import React from 'react'
import { ChatState } from '../../context/chatprov';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = (fetchAgain) => {
  const {selectedChat} = ChatState();
  return (
    <Box d={selectedChat ? "flex" : "none"} alignItems="center" justifyContent="center" p={3} bg="white" w={{ base: "100%", md: "68%" }} borderRadius="lg" borderWidth="1px">
      LiveChat!
      <SingleChat  fetchAgain={fetchAgain}  setfetchAgain={fetchAgain}/>
    </Box>
  )
}

export default ChatBox