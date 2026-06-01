import React, { useEffect, useState } from "react"
import axios from "axios"


const Chatpage = () => {
let [chats,setchat] = useState([])
    const fetchChats = async () => {
        const { data } = await axios.get("/api/chats")
      setchat(data);
    }

    useEffect(() => {
        fetchChats()
    }, [])

  return (
    <div>
        <ul>
        {chats.map((chat) => (
             
                <li key={chat._id}>{chat.chatName}</li>
            
        ))}
        </ul>
    </div>
)
}

export default Chatpage