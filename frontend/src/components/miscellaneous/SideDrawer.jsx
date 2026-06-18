import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Menu,
  Input,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { FaBell, FaChevronDown, FaSearch } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import ProfileDialogs from "./ProfileDialogs";
import { useNavigate } from "react-router-dom";
import { CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/userListItem";

function SideDrawer() {
  // const { user } = ChatState();
  // const [selectedChat, setSelectedChat] = useState();
  // const [chats, setChats] = useState();
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const accessChat = async (userId) => {
   
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log("2. Before API call");
      const { data } = await axios.post("/api/chat", { userId }, config);
      console.log("3. API Response:", data);
      
      if (!chats?.find((c) => c._id === data._id)) {
          
          setChats([data, ...chats]);
        }

      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false); //to clse the drawer after fidning chat............
    } catch (error) {
      console.log(error.message);
      toaster.create({
        title: "Error fetching chat!",
        description:error.message,
        type: "error",
        closable: true,
        duration: 5000,
        placement: "top-start",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Enter some keywords to search!",
        type: "warning",
        closable: true,
        duration: 5000,
        placement: "top-start",
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "error",
        duration: "5000",
        closable: true,
      });
      setLoading(false);
      return;
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="10px"
      borderBottom="1px solid"
    >
      <Drawer.Root placement="start"
        open={open}
        onOpenChange={(e)=>{setOpen(e.open)}}>
        <Drawer.Trigger asChild>
          <Button variant="ghost">
            <FaSearch />
            <Text ml={2}>Search User</Text>
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Search User</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Box display={"flex"} pb={2}>
                  <Input
                    placeholder="Search by name or email"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && <Spinner ml="auto" display="flex" />}
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <Text fontSize="2xl" fontWeight="bold">
        Chit-Chat-Messenger
      </Text>

      <Box display="flex" alignItems="center" gap={4}>
        {/* Notification Menu */}
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="ghost">
              <FaBell size={20} />
            </Button>
          </Menu.Trigger>

          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="notifications">No New Notifications</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>

        {/* User Menu */}
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="ghost">
              <Box
                w="32px"
                h="32px"
                borderRadius="full"
                bg="gray.300"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Box>

              <FaChevronDown style={{ marginLeft: "8px" }} />
            </Button>
          </Menu.Trigger>

          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="profile" user={user} asChild>
                <ProfileDialogs />
              </Menu.Item>

              <Menu.Item value="logout" onClick={logoutHandler}>
                Logout
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Box>
    </Box>
  );
}

export default SideDrawer;
