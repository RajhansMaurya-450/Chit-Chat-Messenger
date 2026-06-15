const express = require ("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const app = express();
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const { chats } = require("./data");
dotenv.config();
connectDB();
const PORT = process.env.PORT || 2000;
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.listen(PORT,()=>{
   console.log(`Server listening on port ${PORT}`);
});

app.use(express.json());

app.get("/", (req, res) => {
    
    res.send("home route");

})

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/api/chats",(req,res)=>{
    
    res.send(chats);
})

app.get("/api/chats/:id",(req,res)=>{
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat);
})