import React, { useCallback, useEffect, useState } from 'react';
import { ChatState } from '../../context/chatprov';
import { 
  useToast, 
  Box, 
  Stack, 
  Text, 
  Button, 
  Avatar, 
  AvatarGroup, 
  HStack, 
  Badge,
  Flex 
} from '@chakra-ui/react';
import axios from 'axios';
import Loading from './Loading';

// Import your custom Chatlogics helper
import Chatlogics from '../../config/Chatlogics'; 

// Font Awesome Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUsers } from '@fortawesome/free-solid-svg-icons';

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

const fetchChats = useCallback(async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get("/api/chats", config);
    setChats(data);
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: "Failed to Load the chats",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom-left",
    });
  }
}, [user, setChats, toast]);

useEffect(() => {
  setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  if (user) {
    fetchChats();
  }
}, [user, fetchChats]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      bg="white"
      w={{ base: "100%", md: "32%", lg: "30%" }}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.100"
      boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.05)"
      h="88vh"
    >
      {/* Header Bar */}
      <Box
        pb={4}
        px={1}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          fontSize={{ base: "22px", md: "24px" }}
          fontFamily="Work Sans"
          fontWeight="bold"
          color="gray.800"
          letterSpacing="tight"
        >
          My Chats
        </Text>
        
        <Button
          display="flex"
          fontSize="14px"
          colorScheme="teal"
          variant="solid"
          borderRadius="xl"
          shadow="sm"
          _hover={{ transform: "translateY(-1px)", shadow: "md" }}
          transition="all 0.2s"
          leftIcon={<FontAwesomeIcon icon={faPlus} />}
        >
          New Group
        </Button>
      </Box>

      {/* Chat List Container */}
      <Box
        display="flex"
        flexDir="column"
        p={2}
        bg="gray.50"
        w="100%"
        h="100%"
        borderRadius="xl"
        overflowY="hidden"
      >
        {chats ? (
          <Stack 
            spacing={2} 
            overflowY="scroll" 
            pr={1}
            css={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '24px' },
            }}
          >
            {chats.map((chat) => {
              // Using Chatlogics to extract the other user details when not a group chat
              const otherUser = !chat.isGroupChat && loggedUser ? Chatlogics(loggedUser, chat.users) : null;
              const isSelected = selectedChat?._id === chat._id;

              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={isSelected ? "teal.500" : "white"}
                  color={isSelected ? "white" : "gray.800"}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  key={chat._id}
                  boxShadow={isSelected ? "md" : "xs"}
                  borderWidth="1px"
                  borderColor={isSelected ? "teal.500" : "gray.100"}
                  transition="all 0.2s ease-in-out"
                  _hover={{
                    bg: isSelected ? "teal.600" : "teal.50",
                    transform: "scale(1.01)",
                  }}
                >
                  <HStack spacing={3} align="center">
                    {/* Render Avatar for 1-on-1 vs Group Chat */}
                    {!chat.isGroupChat ? (
                      <Avatar
                        size="md"
                        name={otherUser?.name}
                        src={otherUser?.pic}
                        borderWidth={isSelected ? "2px" : "0px"}
                        borderColor="white"
                      />
                    ) : (
                      <AvatarGroup size="sm" max={2} border="none">
                        <Avatar icon={<FontAwesomeIcon icon={faUsers} />} bg="teal.100" color="teal.700" />
                      </AvatarGroup>
                    )}

                    <Flex flexDir="column" flex={1} overflow="hidden">
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text 
                          fontWeight="bold" 
                          fontSize="md" 
                          isTruncated
                          color={isSelected ? "white" : "gray.800"}
                        >
                          {!chat.isGroupChat
                            ? otherUser?.name
                            : chat.chatName}
                        </Text>
                        
                        {chat.isGroupChat && (
                          <Badge 
                            colorScheme={isSelected ? "teal" : "gray"} 
                            variant={isSelected ? "solid" : "subtle"} 
                            fontSize="xs" 
                            borderRadius="md"
                          >
                            Group
                          </Badge>
                        )}
                      </Flex>

                      {/* Display Latest Message preview if available */}
                      {chat.latestMessage && (
                        <Text 
                          fontSize="xs" 
                          color={isSelected ? "gray.100" : "gray.500"} 
                          isTruncated
                          mt={0.5}
                        >
                          <b>{chat.latestMessage.sender.name}: </b>
                          {chat.latestMessage.content.length > 30
                            ? chat.latestMessage.content.substring(0, 31) + "..."
                            : chat.latestMessage.content}
                        </Text>
                      )}
                    </Flex>
                  </HStack>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Loading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;