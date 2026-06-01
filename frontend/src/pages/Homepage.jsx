import { Box, Container, Text, Tabs } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily={"Work sans"} color={"black"}>
          Chit-Chat Messenger
        </Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs.Root
          defaultValue="login"
          variant="plain"
          css={{
            "--tabs-indicator-bg": "colors.green.500",
            "--tabs-indicator-shadow": "shadows.xs",
            "--tabs-trigger-radius": "radii.full",
          }}
        >
          <Tabs.List mb={"1rem"} display={"flex"}>
            <Tabs.Trigger
              value="login"
              width={"50%"}
              display={"flex"}
              justifyContent="center"
              alignItems="center"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="signup"
              width={"50%"}
              display={"flex"}
              justifyContent="center"
              alignItems="center"
            >
              Sign Up
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="login">
            <Login></Login>
          </Tabs.Content>
          <Tabs.Content value="signup">
            <Signup></Signup>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
}

export default Homepage;
