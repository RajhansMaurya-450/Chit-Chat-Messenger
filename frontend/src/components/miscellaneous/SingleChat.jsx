import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileDialogs from "./ProfileDialogs";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

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
                  setfetchAgain={setfetchAgain}
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
            {/* Messages Here */}
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