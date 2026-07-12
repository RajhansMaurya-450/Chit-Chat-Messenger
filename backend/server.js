const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const app = express();
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { chats } = require("./data");
dotenv.config();
connectDB();
const PORT = process.env.PORT || 2000;
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { Socket } = require("socket.io");

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.use(express.json());

app.get("/", (req, res) => {

    res.send("home route");

})

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/api/chats", (req, res) => {

    res.send(chats);
})

app.get("/api/chats/:id", (req, res) => {
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");


    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room:" + room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


    socket.on("new message", (newMessageReceived) => {
        const chat = newMessageReceived.chat;

        if (!chat.users) {
            return console.log("chat.users not defined");
        }

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageReceived);
        });
    });
    //socket off..............
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});