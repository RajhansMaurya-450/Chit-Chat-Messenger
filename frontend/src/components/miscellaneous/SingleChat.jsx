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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

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
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
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
        setMessage([...messages, data]);

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

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
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
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
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
              <div>{/*messages*/}</div>
            )}

            <Field.Root onKeyDown={sendMessage} required mt={3}>
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