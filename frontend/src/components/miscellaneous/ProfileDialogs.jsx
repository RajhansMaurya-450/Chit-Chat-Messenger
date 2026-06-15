import React from "react";
import {
  Button,
  CloseButton,
  Dialog,
  IconButton,
  Portal,
  Image,
  Text,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";

const ProfileDialogs = ({ user, children }) => {
  return (
    <Dialog.Root placement="center" size="cover">
      {children ? (
        <Dialog.Trigger asChild>
          <span>{children}</span>
        </Dialog.Trigger>
      ) : (
        <Dialog.Trigger asChild>
          <IconButton
            display={{ base: "flex" }}
            aria-label="View Profile"
          >
            <FiEye />
          </IconButton>
        </Dialog.Trigger>
      )}

      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{user?.name}</Dialog.Title>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={4}
            >
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user?.image}
                alt={user?.name}
              />

              <Text
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work Sans"
              >
                Email: {user.email}
                
              </Text>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ProfileDialogs;