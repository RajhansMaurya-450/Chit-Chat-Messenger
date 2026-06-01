const express = require ("express");
const dotenv = require("dotenv");
const app = express();
const {chats} = require("./data");
dotenv.config();
const PORT = process.env.PORT || 2000;

app.listen(PORT,()=>{
   console.log(`Server listening on port ${PORT}`);
});

app.get("/",(req,res)=>{
    res.send("home route");
})

app.get("/api/chats",(req,res)=>{
    
    res.send(chats);
})

app.get("/api/chats/:id",(req,res)=>{
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat);
})