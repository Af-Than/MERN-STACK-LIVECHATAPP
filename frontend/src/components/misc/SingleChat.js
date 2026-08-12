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
import io from "socket.io-client";

var socket, selectedChatCompare;

const ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "http://localhost:5000";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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
      if (socket) {
        socket.emit("join chat", selectedChat._id);
      }
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

  // Socket Initial Setup
  useEffect(() => {
    if (!user) return;
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Fetch messages whenever active selected chat updates
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // Handle incoming real-time socket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // Notification handling can be triggered here
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, []);

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

        if (socket) {
          socket.emit("new message", data);
        }
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
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)"
          overflowY={{ md: "hidden" }}
        >
          {/* Header Bar */}
          <Box
            pb={{ base: 3 }}
            px={{ base: 2 }}
            fontSize={{ base: "18px", md: "22px" }}
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            w="100%"
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
                <Text color="gray.700" fontWeight="600" letterSpacing="0.2px">
                  {getSender(user, selectedChat.users)}
                </Text>
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <Text
                  color="gray.800"
                  fontWeight="600"
                  letterSpacing="0.5px"
                  textAlign="center"
                  flex="1"
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

          {/* Chat Messages Body */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            p={4}
            bg="#F7FAFC"
            w="100%"
            h="100%"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
            overflowY="hidden"
            mt={3}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={12}
                h={12}
                thickness="3px"
                color="teal.400"
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box display="flex" flexDir="column" overflowY="hidden" h="100%">
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
                  borderColor="gray.200"
                  boxShadow="0px 2px 8px rgba(0,0,0,0.04)"
                  _hover={{ borderColor: "teal.300" }}
                  _focus={{
                    borderColor: "teal.400",
                    boxShadow: "0 0 0 2px rgba(56, 178, 172, 0.2)",
                  }}
                  pr="4.5rem"
                />
                <InputRightElement width="3.5rem">
                  <IconButton
                    size="sm"
                    colorScheme="teal"
                    borderRadius="full"
                    icon={<ArrowForwardIcon />}
                    onClick={sendMessage}
                    isDisabled={!newMessage.trim()}
                    w="2.2rem"
                    h="2.2rem"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </Box>
      ) : (
        /* Unselected State Screen */
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          w="100%"
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="sm"
          flexDir="column"
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