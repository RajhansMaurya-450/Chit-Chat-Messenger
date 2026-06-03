import React from 'react'
import {
  VStack,
  Field,
  Input,
  InputGroup,
  Button,
} from '@chakra-ui/react'
import { useState } from "react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import {useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false)
  const navigate  = useNavigate();

  const handleClick = () => setShowPassword(!show);

  const SubmitHandler = async() => {

    setloading(true);
        if (!email || !password) {
           toaster.create({
            title: "Fields should not be blank!",
            type: "error",
            duration: 5000,
            position: "bottom",
          });
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
        "/api/user/login",
        {email, password},
        config
      );
      toaster.create({
        title: "login Successful!",
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
  }
  
  return (
    <VStack>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
      </Field.Root>
       <Button
              colorPalette={"blue"}
              width={"100%"}
              style={{ marginTop: 15 }}
              onClick={SubmitHandler}
              loading={loading}
            > Login
      </Button>
      <Button
              colorPalette={"red"}
              width={"100%"}
              style={{ marginTop: 2 }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
              }}
            > Login as Guest
            </Button>
    </VStack>
  )
}

export default Login
