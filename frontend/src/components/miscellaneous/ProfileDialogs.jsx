import React, { Children } from 'react'
import { Button, CloseButton, Dialog, IconButton, Portal, useDisclosure } from "@chakra-ui/react"

const ProfileDialogs = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
          <IconButton display={{base: "flex"}} icon={<viewIcon/>} onClick={onOpen} />
      )}
    <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm">
          my profile
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
      </Dialog.Root>
      </>
  )
}



export default ProfileDialogs;
