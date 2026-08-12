import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatprov";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/Chatlogics";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage.trim()) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messageText = newMessage;
        setNewMessage("");

        const { data } = await axios.post(
          "/api/messages",
          {
            content: messageText,
            chatId: selectedChat._id,
          },
          config
        );
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <Box
          display="flex"
          flexDir="column"
          justifyContent="space-between"
          p={{ base: 3, md: 4 }}
          bg="white"
          w="100%"
          h="100%"
          borderRadius="2xl"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)"
          overflowY="hidden"
          border="1px solid"
          borderColor="gray.100"
        >
          {/* Header Bar */}
          <Box
            fontSize={{ base: "18px", md: "22px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              variant="ghost"
              colorScheme="teal"
              borderRadius="full"
            />

            {!selectedChat.isGroupChat ? (
              <>
                <Text fontWeight="600" color="gray.700" letterSpacing="0.2px">
                  {getSender(user, selectedChat.users)}
                </Text>
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <Text
                  fontWeight="600"
                  color="gray.800"
                  textAlign="center"
                  flex="1"
                  letterSpacing="0.5px"
                >
                  {selectedChat.chatName.toUpperCase()}
                </Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Box>

          {/* Chat Container */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            p={4}
            bg="#F7FAFC"
            w="100%"
            h="100%"
            borderRadius="xl"
            overflowY="hidden"
            mt={3}
            border="1px solid"
            borderColor="gray.100"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={12}
                h={12}
                alignSelf="center"
                margin="auto"
                color="teal.400"
                thickness="3px"
              />
            ) : (
              <Box
                display="flex"
                flexDir="column"
                h="100%"
                overflowY="hidden"
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}

            {/* Input Bar */}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <InputGroup size="lg">
                <Input
                  variant="outline"
                  bg="white"
                  placeholder="Type a message..."
                  onChange={typingHandler}
                  value={newMessage}
                  borderRadius="full"
                  fontSize="15px"
                  pr="4.5rem"
                  boxShadow="0px 2px 8px rgba(0,0,0,0.04)"
                  borderColor="gray.200"
                  _hover={{ borderColor: "teal.300" }}
                  _focus={{
                    borderColor: "teal.400",
                    boxShadow: "0 0 0 2px rgba(56, 178, 172, 0.2)",
                  }}
                />
                <InputRightElement width="3.5rem">
                  <IconButton
                    h="2.2rem"
                    w="2.2rem"
                    size="sm"
                    colorScheme="teal"
                    borderRadius="full"
                    icon={<ArrowForwardIcon />}
                    onClick={sendMessage}
                    isDisabled={!newMessage.trim()}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </Box>
      ) : (
        /* Empty State Screen */
        <Box
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          h="100%"
          w="100%"
          bg="white"
          borderRadius="2xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <Text
            fontSize="2xl"
            fontFamily="Work Sans"
            color="gray.400"
            fontWeight="400"
          >
            Select a conversation to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;