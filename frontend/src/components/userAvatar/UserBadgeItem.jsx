import React from "react";
import { Box } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize="12px"
      bg="orange.400"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <IoClose />
    </Box>
  );
};

export default UserBadgeItem;