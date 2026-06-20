import React from "react";
import {
    Button,
    CloseButton,
    Dialog,
    IconButton,
    Portal,
    Image,
    Text,
    Box,
    Field,
    Input,
    FieldRoot,
    Spinner,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";
import { ChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import { toaster } from "../ui/toaster";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../userAvatar/userListItem";

const UpdateGroupChatModal = ({ children, fetchAgain, setFetchAgain }) => {
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const { selectedChat, setSelectedChat, user } = ChatState();
    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toaster.create({
                title: "Only admins can remove someone!",
                type: "error",
                closable: true,
                duration: 5000,
                placement: "bottom",
            });
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `api/chat/groupremove`, {
                chatId: selectedChat._id,
                userId: user1._id,
            },
                config
            );
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        }
        catch (error) {
            toaster.create({
                title: "Error Occured!",
                status: "error",
                duration: 5000,
                placement: "bottom",
                closable: true,
            });
            setLoading(false);
        }
    };
    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toaster.create({
                title: "User already in group!",
                type: "error",
                closable: true,
                duration: 5000,
                placement: "bottom",
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toaster.create({
                title: "Only admins can add someone!",
                type: "error",
                closable: true,
                duration: 5000,
                placement: "bottom",
            });
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: user1._id,
            },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        }
        catch (error) {
            toaster.create({
                title: "Error Occured!",
                status: "error",
                duration: 5000,
                placement: "bottom",
                closable: true,
            });
            setLoading(false);
        }
    };
    const handleRename = async () => {
        if (!groupChatName) {
            toaster.create({
                title: "GroupChat Name cannot be empty!",
                type: "warning",
                closable: true,
                duration: 5000,
                placement: "top-start",
            });
            return;
        }

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName,
            },
                config,
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        }
        catch (error) {
            toaster.create({
                title: "Error Occured!",
                status: "error",
                duration: 5000,
                placement: "bottom",
                closable: true,
            });
            console.log(error);
        }
        setRenameLoading(false);
        setGroupChatName("");
    };
    const handleSearch = async (query) => {
        setSearch(query);

        if (!query) return;

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setSearchResult(data);
            console.log(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);

            toaster.create({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                type: "error",
                duration: 5000,
            });
        }
    };
    return (
        <>
            <Dialog.Root placement="center" size="md"
                motionPreset="slide-in-bottom">

                <Dialog.Trigger asChild>
                    {children}
                </Dialog.Trigger>

                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header
                                fontSize={"35px"}
                                fontFamily={"Work sans"}
                                display={"flex"}
                                justifyContent={"center"}>
                                <Dialog.Title>{selectedChat.chatName}</Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body>
                                {/* Selected Users */}
                                <Box
                                    w="100%"
                                    display="flex"
                                    flexWrap="wrap"
                                    gap={2}
                                    pb={4}
                                >
                                    {selectedChat.users.map((u) => (
                                        <UserBadgeItem
                                            key={u._id}
                                            user={u}
                                            handleFunction={() => handleRemove(u)}
                                        />
                                    ))}
                                </Box>

                                {/* Rename Group */}
                                <Box display="flex" gap={2} mb={4}>
                                    <Input
                                        placeholder="Chat Name"
                                        id="chatName"
                                        value={groupChatName}
                                        onChange={(e) => setGroupChatName(e.target.value)}
                                    />

                                    <Button
                                        colorPalette="teal"
                                        loading={renameLoading}
                                        onClick={handleRename}
                                    >
                                        Update
                                    </Button>
                                </Box>

                                {/* Add Users */}
                                <Field.Root>
                                    <Input
                                        id="search"
                                        value={search}
                                        placeholder="Add user to group"
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </Field.Root>
                                {loading ? (
                                    <Spinner size={"lg"} />
                                ) : (
                                    searchResult?.map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => handleAddUser(user)}
                                        />
                                    ))
                                )}
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Button
                                    colorPalette="red"
                                    onClick={() => handleRemove(user)}

                                >
                                    Leave Group
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

        </>
    )
}

export default UpdateGroupChatModal
