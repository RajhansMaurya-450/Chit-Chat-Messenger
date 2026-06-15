import { Box, Text, Avatar } from "@chakra-ui/react";

import axios from "axios";

const UserListItem = ({ user, handleFunction }) => {
  

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        bg: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar.Root size="sm" mr={2}>
        <Avatar.Fallback name={user?.name} />
        <Avatar.Image
          src={user?.Image}
          alt={user?.name}
          cursor="pointer"
        />
      </Avatar.Root>

      <Box>
        <Text>{user?.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user?.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;