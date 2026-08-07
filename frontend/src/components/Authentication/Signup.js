import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  Input,
  FormLabel,
  Button,
  InputRightElement,
  InputGroup, // 👈 Added InputGroup import
} from '@chakra-ui/react';

function Signup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState();

  const handleClick = () => setShow(!show);

  const setpics  = (pics) => {
    if (pics === undefined) {
      console.log('Please select an image!');
      return;
    }
}

const submitHandler = () => {
}


  return (
    <VStack spacing={4} align="stretch">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? 'text' : 'password'} 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
         <InputGroup size="md">
          <Input
            type={show ? 'text' : 'password'} 
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Profile Picture</FormLabel>
         <InputGroup size="md">
          <Input
            type="file"
            placeholder="Upload your profile picture"
            accept="image/*"
            onChange={(e) => setPic(e.target.files[0])}
          />
         
        </InputGroup>
      </FormControl>
      <Button colorScheme="blue" width="100%" mt={4} onClick={submitHandler}>
        Sign Up
      </Button>
    </VStack>
  );
}
export default Signup;