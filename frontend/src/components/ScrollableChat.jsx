import React from "react";
//import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import {
    islastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "./config/ChatLogic";
import { Avatar, Box, Text } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    if (!messages || !user) return null;

    return (
        <>
            {messages.map((m, i) => (
                <Box
                    key={m._id}
                    display="flex"
                    alignItems="center"
                    mt={1}
                >
                    {(isSameSender(messages, m, i, user._id) ||
                        islastMessage(messages, i, user._id)) && (
                            <Avatar.Root size="sm" mr={2}>
                                <Avatar.Image src={m?.sender?.image} />
                                <Avatar.Fallback name={m?.sender?.name || "U"} />
                            </Avatar.Root>
                        )}

                    <Box
                        bg={m.sender._id === user._id ? "green.300" : "blue.300"}
                        borderRadius="20px"
                        px={4}
                        py={2}
                        maxW="75%"
                        ml={isSameSenderMargin(messages, m, i, user._id)}
                        mt={isSameUser(messages, m, i) ? 1 : 3}
                    >
                        <Text fontSize="sm">{m.content}</Text>
                    </Box>
                </Box>
            ))}
       </>
    );
};

export default ScrollableChat;