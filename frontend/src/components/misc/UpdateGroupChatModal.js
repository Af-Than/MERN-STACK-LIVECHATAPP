import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  Box,
  Input,
  FormControl,
  Spinner
} from '@chakra-ui/react';
import { ChatState } from '../../context/chatprov';
import UserBadge from '../users/userbadge';
import axios from 'axios';
import UserListItem from '../users/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const token = user?.token || user?.data?.token;

  // 1. ADD USER TO GROUP
  const handleGroup = async (userToAdd) => {
    // Check if user is already in the group
    if (selectedChat?.users?.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // Check if logged-in user is admin
    if (selectedChat?.groupAdmin?._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chats/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      if (typeof setFetchAgain === "function") setFetchAgain(!fetchAgain);
      setloading(false);
    } catch (error) {
      setloading(false);
      toast({
        title: "Error occurred while adding user to the chat",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // 2. REMOVE USER / LEAVE GROUP
  const handleRemove = async (userToRemove) => {
    if (selectedChat?.groupAdmin?._id !== user._id && userToRemove._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed space issue after Bearer
        },
      };

      const { data } = await axios.put(
        `/api/chats/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      userToRemove._id === user._id ? setSelectedChat("") : setSelectedChat(data);
      
      if (typeof setFetchAgain === "function") setFetchAgain(!fetchAgain);
      setloading(false);
    } catch (error) {
      setloading(false);
      toast({
        title: "Error occurred while removing user",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // 3. RENAME GROUP
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chats/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      if (typeof setFetchAgain === 'function') {
        setFetchAgain(!fetchAgain);
      }
      setRenameLoading(false);
      setGroupChatName("");
      onClose();
    } catch (error) {
      setRenameLoading(false);
      toast({
        title: "Error occurred while renaming the chat",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // 4. SEARCH USERS
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`/api/users?search=${query}`, config);
      setloading(false);
      setSearchResult(data);
    } catch (error) {
      setloading(false);
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message || "Failed to Load Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen}>
        <i className="fa-solid fa-pencil"></i>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            fontSize={{ base: "28px", md: "30px" }}
            justifyContent="center"
            fontFamily="Work sans"
          >
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" py={2}>
              {selectedChat?.users?.map((u) => (
                <UserBadge
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner my={4} display="block" mx="auto" />
            ) : (
              searchResult?.slice(0, 4).map((userItem) => (
                <UserListItem
                  key={userItem._id}
                  user={userItem}
                  handleFunction={() => handleGroup(userItem)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;