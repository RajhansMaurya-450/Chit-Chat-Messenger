import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, IconButton, Text, Field } from "@chakra-ui/react";
import { Input, InputGroup } from "@chakra-ui/react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileDialogs from "./ProfileDialogs";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { toaster } from "../ui/toaster";
import ScrollableChat from "../ScrollableChat";
import { useRef } from "react";
import io from "socket.io-client";
import LottieImport from "lottie-react";
const Lottie = LottieImport.default || LottieImport;
import animationData from "../../animation/LoadingAnimation.json";
console.log(animationData);
console.log(Lottie);


const ENDPOINT = "http://localhost:2000/";
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      console.log(data);
      setMessage(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Unable to fetch Message",
        type: "error",
        duration: 5000,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;

    const messageHandler = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        console.log("notification");
      } else {
        setMessage((prev) => [...prev, newMessageReceived]);
      }
    };

    socket.on("message recieved", messageHandler);

    return () => {
      socket.off("message recieved", messageHandler);
    };
  }, [socketConnected]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        // setMessage([...messages, data]);
        setMessage((prev) => [...prev, data]);
        //socket.emit("new message", data);

      } catch (error) {
        toaster.create({
          title: "Error Occured!",
          description: "Failed to send Message",
          type: "error",
          duration: 5000,
          position: "bottom",
        })
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => socket.disconnect();
  }, [user]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var timeDiff = timenow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength)
  }

  return (
    <>
      {selectedChat ? (
        <>
          {/* Header */}
          <Box
            px={2}
            pt={2}
            pb={3}
            w="100%"
            display="flex"
            alignItems="center"
          >
            {/* Mobile Back Button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              variant="ghost"
              aria-label="Back"
              mr={2}
              onClick={() => setSelectedChat("")}
            >
              <IoArrowBackCircleOutline size={30} />
            </IconButton>

            {/* One-to-One Chat */}
            {!selectedChat.isGroupChat ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="100%"
                flex="1"
              >
                <Text fontSize={{ base: "24px", md: "28px" }}>
                  {getSender(user, selectedChat.users)}
                </Text>

                <ProfileDialogs
                  user={getSenderFull(user, selectedChat.users)}
                />
              </Box>
            ) : (
              /* Group Chat */
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="100%"
                flex="1"
              >
                <Text fontSize={{ base: "24px", md: "28px" }}>
                  {selectedChat.chatName.toUpperCase()}
                </Text>

                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                >
                  <IconButton aria-label="Update Group" variant="ghost">
                    <FaEye size={20} />
                  </IconButton>
                </UpdateGroupChatModal>
              </Box>
            )}
          </Box>

          {/* Chat Messages Box */}
          <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="calc(100vh - 170px)"
            borderRadius="lg"
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <Box flex="1" overflowY="auto">
                <ScrollableChat messages={messages} />
                <div ref={messagesEndRef} />
              </Box>
            )}

            {/* this logic will get triggered when user start typing */}
            <Field.Root onKeyDown={sendMessage} required mt={3}>
              {isTyping ? <div
                style={{ width: 120 }}>
                <Lottie animationData={animationData} loop />
              </div> : <></>
              }
              <InputGroup>
                <Input
                  variant="filled"
                  bg="rgba(0, 190, 73, 0.31))"
                  placeholder="Enter a message.."
                  onChange={typingHandler}
                  value={newMessage}
                />
              </InputGroup>
            </Field.Root>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100%"
          h="100vh"
        >
          <Text fontSize="3xl" fontFamily="Work Sans">
            Click on user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;