import React from "react";
import { VStack, Field, Input, InputGroup, Button } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [image, setImage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const postDetails = (file) => {
    if (file == undefined) {
      toaster.create({
        title: "Please select an image",
        type: "warning",
        closable: true,
        duration: 5000,
      });
      return;
    }
    
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chit-chat");
      data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
      
      fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {

          setImage(data.secure_url);
          //setImage(data.url.toString());
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
          toaster.create({
            title: "Error Occured while uploading the image",
            type: "error",
            closable: true,
            duration: 5000,
          });
        });
    } else {
      toaster.create({
        title: "Please select a valid image file (JPEG or PNG)",
        type: "warning",
        closable: true,
        duration: 5000,
      });
      setloading(false);
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
    }
    if (password != confirmpassword) {
      toaster.create({
        title: `password didnt matched`,
        type: "warning",
        duration: 5000,
        position: "bottom",
      });
      setloading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
     
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, image },
        config,
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Email:</Field.Label>
        <Input
          placeholder="Enter your Email"
          value={email}
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
          p={1.5}
          accept="image/*"
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
      >
        {" "}
        SignUp
      </Button>
    </VStack>
  );
};

export default Signup;
