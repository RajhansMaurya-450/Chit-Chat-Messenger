import React from "react";
import {
  VStack,
  Field,
  Input,
  InputGroup,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import {useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [image, setImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setloading] = useState(false)
  const navigate  = useNavigate();


  const handleClick = () => setShow(!show);
  

  const postDetails = (image) => {
    if (image == undefined) {
       toaster.create({
                title: `Toast status is ${type}`,
                type: success,
              })
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "chit-chat");
      data.append("cloud_name", process.env.CLOUD_NAME);
      fetch("https://api.cloudinary.com/v1_1/CLOUD_NAME/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setImage(data.url.toString());
          setloading(false);
        });
    } else {
       toaster.create({
                title: `Toast status is ${type}`,
                type: warning,
              })
      return;
    }
  };
  const SubmitHandler = async () => {

    setloading(true);
    if (!name || !email || !password || !confirmpassword) {
       toaster.create({
        title: "Fields should not be blank!",
        type: "error",
        duration: 5000,
        position: "bottom",
      });
      setloading(false);
      return;
    } if (password != confirmpassword) {
      toaster.create({
        title: `password didnt matched`,
        type: "warning",
        duration: 5000,
        position: "bottom",
      })
      setloading(false);
      return;
    }

    try {
      const config = {
        Headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, image },
        config
      );
      toaster.create({
        title: "Registration Successful!",
        type: "success",
        duration: 5000,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      setloading(false);
      navigate("/chats");
    } catch (error) {
       toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
        position: "bottom",
       });
      setloading(false);
    }
  };
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
        loading={loading}
      > SignUp
      </Button>
    </VStack>
  );
};

export default Signup;
