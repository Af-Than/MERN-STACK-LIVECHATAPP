import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Spinner,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { ChatState } from '../../context/chatprov';
import UserListItem from '../users/UserListItem';
import UserBadge from '../users/userbadge';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setloading] = React.useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const Handlesearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]); // Reset results when input is cleared
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
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

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Fixed endpoint spacing & safely extract string response
      const { data } = await axios.post(
        "/api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        // FIX: Extract string message instead of passing an object
        description: error.response?.data?.message || error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToDelete._id));
  };

  return (
    <>  
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work Sans"
            fontWeight="bold"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users"
                mb={1}
                value={search}
                onChange={(e) => Handlesearch(e.target.value)}
              />
            </FormControl>

            {/* Container for selected user badges */}
            <Box w="100%" display="flex" flexWrap="wrap" py={2}>
              {selectedUsers.map((u) => (
                <UserBadge
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <Spinner my={4} />
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;