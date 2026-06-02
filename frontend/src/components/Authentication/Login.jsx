import React from 'react'
import {
  VStack,
  Field,
  Input,
  InputGroup,
  Button,
} from '@chakra-ui/react'
  import { useState } from "react";


const Login = () => {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const SubmitHandler = () => { }
  
  return (
    <VStack>
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
       <Button
              colorPalette={"blue"}
              width={"100%"}
              style={{ marginTop: 15 }}
              onClick={SubmitHandler}
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
