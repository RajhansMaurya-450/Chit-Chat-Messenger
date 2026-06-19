import React, { useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Input,
  Portal,
  Field,
  Box,
  Text
} from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../userAvatar/userListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { Spinner } from "@chakra-ui/react";


const GroupChatModals = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();
  const [open, setOpen] = useState(false);

  //   const handleSubmit = async () => {
  //     if (!groupChatName || !selectedUsers) {
  //       toaster.create({
  //         title: "Fields should not be blank!",
  //         type: "error",
  //         duration: 5000,
  //         position: "bottom",
  //       });
  //       return;
  //     }

  //     try {
  //       const config = {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //         };

  //         const { data } = await axios.post("api/chat/group",
  //             {
  //                 name: groupChatName,
  //                 users: JSON.stringify(selectedUsers.map((u) => u._id)),
  //             },
  //             config
  //         );
  //         setChats([data, ...chats]);
  //         toaster.create({
  //             title: "New Group Chat Created!",
  //             status: "success",
  //             duration: 5000,
  //             isClosable:true,
  //         });
  //     } catch (error) {
  //         toaster.create({
  //             title: "Failed to Create the chat!",
  //             status: "error",
  //             description: error.response.data,
  //             duration: 5000,
  //             isClosable: true,
  //         })
  //     }
  //   };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        title: "All Fields are mandatory",
        type: "warning",
        closable: true,
        duration: 5000,
        placement: "top-start"
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }
      const { data } = await axios.post("/api/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id))
      },
        config
      );
      setChats([data, ...chats]);
      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);
      setOpen(false);

      toaster.create({
        title: "New Group Chat Created!",
        type: "success",
        closable: true,
        duration: 5000,
        placement: "top-start"
      });
    }
    catch (error) {
      toaster.create({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        type: "error",
        closable: true,
        duration: 5000,
        placement: "top-start"
      });
    }
  };
  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
  };

  //   const handleGroup = (userToAdd) => {
  //     if (selectedUsers.includes(userToAdd)) {
  //       toaster.create({
  //         title: "User already added",
  //         type: "warning",
  //         duration: 5000,
  //       });
  //       return;
  //     }
  //   };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toaster.create({
        title: "User already added",
        type: "warning",
        duration: 5000,
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
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
    <Dialog.Root placement="center" motionPreset="slide-in-bottom"
      open={open}
      onOpenChange={(e) => setOpen(e.open) }>
      <Dialog.Trigger asChild>
        <span onClick={()=>setOpen(true)}>{children}</span>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header display="flex" justifyContent="center">
              <Dialog.Title fontSize="35px" fontFamily="Work Sans">
                Create Group Chat
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body display="flex" flexDirection="column" gap={3}>
              <Field.Root>
                <Input
                  placeholder="Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Input
                  placeholder="Add Users eg: John, Raj, Gwen"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Field.Root>

              <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>

              {/* selected users */}
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Button colorPalette="green" onClick={handleSubmit}>
                Create Chat
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default GroupChatModals;
