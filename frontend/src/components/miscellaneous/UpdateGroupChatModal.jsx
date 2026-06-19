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
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";
import { ChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import { toaster } from "../ui/toaster";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const UpdateGroupChatModal = ({ children, fetchAgain, setfetchAgain }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const { selectedChat, setSelectedChat, user } = ChatState();
    const handleRemove = () => { };
    const handleRename = () => { };
    const handleSearch = () => { };
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
                                        value={groupChatName}
                                        onChange={(e) => setGroupChatName(e.target.value)}
                                    />

                                    <Button
                                        colorPalette="teal"
                                        onClick={handleRename}
                                    >
                                        Update
                                    </Button>
                                </Box>

                                {/* Add Users */}
                                <Field.Root>
                                    <Input
                                        placeholder="Add user to group"
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </Field.Root>
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
