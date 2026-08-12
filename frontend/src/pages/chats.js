import React from 'react';
import { ChatState } from '../context/chatprov';
import { Box } from '@chakra-ui/react';
import Sidedrawer from '../components/misc/Sidedrawer';
import MyChats from '../components/misc/MyChats';
import ChatBox from '../components/misc/ChatBox';

function Chats() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = React.useState(false);

  return (
    <Box
      // 1. Add your background image URL here
      bgImage="url('https://plus.unsplash.com/premium_photo-1701590725721-add548ecdf61?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      
      // 2. Styling to fit the viewport properly
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      w="100%"
      minH="100vh"
    >
      {user && <Sidedrawer />}
      
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain}/>}
      </Box>

      <h2>Welcome, {user?.name}</h2>
    </Box>
  );
}

export default Chats;