import React from "react";
import {
  VStack,
  Field,
  Input,
  InputGroup,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [image, setImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const postDetails = (image) => {}
  const SubmitHandler = () => {}
  return (
    <VStack>
      <Field.Root required>
        <Field.Label>Name:</Field.Label>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Email:</Field.Label>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Password:</Field.Label>

        <InputGroup
          endElement={
            <Button
              size="xs"
              colorPalette="gray"
              variant="subtle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          }
        >
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
      </Field.Root>

      <Field.Root required>
        <Field.Label>Confirm Password:</Field.Label>

        <InputGroup
          endElement={
            <Button
              size="xs"
              colorPalette="gray"
              variant="subtle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          }
        >
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
        </InputGroup>
      </Field.Root>

      <Field.Root required>
        <Field.Label>Image:</Field.Label>
        <Input
          type="file"
          placeholder="Upload a profile picture!"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </Field.Root>

      <Button
        colorPalette={"green"}
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={SubmitHandler}
      > SignUp
      </Button>
    </VStack>
  );
};

export default Signup;
