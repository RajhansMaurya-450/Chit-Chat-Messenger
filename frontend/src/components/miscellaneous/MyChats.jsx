import React, { useState } from 'react'
import { toaster } from "../ui/toaster";
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);

    } catch (error) {
    
    }
    return
  }
}
export default MyChats
