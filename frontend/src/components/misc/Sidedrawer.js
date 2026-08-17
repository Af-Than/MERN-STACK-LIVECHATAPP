import React, { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Text,
  Tooltip,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  Image,
  Badge,
} from '@chakra-ui/react';
import axios from 'axios';
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../users/images.png';
import { ChatState } from '../../context/chatprov';
import ProfileModel from './ProfileModel';
import Loading from './Loading';
import UserListItem from '../users/UserListItem';
import { getSender } from '../../config/Chatlogics';


const Sidedrawer = () => {
  const { user, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const prevNotifCountRef = useRef(notifications.length);

  // Sound notification effect whenever new notification arrives
  useEffect(() => {
    if (notifications.length > prevNotifCountRef.current) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5 note

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (err) {
        // Fallback or handle browser autoplay policy restrictions silently
      }
    }
    prevNotifCountRef.current = notifications.length;
  }, [notifications.length]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/users?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chats`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="8px 16px"
        borderBottomWidth="1px"
        borderColor="gray.200"
        boxShadow="sm"
      >
        {/* Search Button */}
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            leftIcon={<SearchIcon color="gray.600" />}
            _hover={{ bg: "gray.100" }}
            borderRadius="md"
          >
            <Text display={{ base: "none", md: "inline" }} px={2} color="gray.700">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Box display="flex" alignItems="center" gap={3}>
          <Text
            fontSize="3xl"
            fontFamily="'Poppins', 'Outfit', sans-serif"
            fontWeight="900"
            letterSpacing="wider"
            color="teal.600"
            cursor="pointer"
            transition="all 0.4s ease-in-out"
            _hover={{
              bgGradient: "linear(to-r, red.400, orange.400, yellow.400, green.400, blue.400, purple.500)",
              bgClip: "text",
              textShadow: "0 0 12px rgba(236, 72, 153, 0.6), 0 0 24px rgba(59, 130, 246, 0.4)",
              transform: "scale(1.05)",
            }}
          >
            ApeX Chat
          </Text>

          <Image
            src={logo}
            alt="ApeX Chat Logo"
            boxSize="45px"
            objectFit="contain"
            transition="transform 0.3s ease"
            _hover={{ transform: "rotate(12deg) scale(1.1)" }}
          />
        </Box>

        {/* Right Action Icons */}
        <HStack spacing={3}>
          {/* Notifications Menu with Counter Badge */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              p={2}
              borderRadius="full"
              _hover={{ bg: "gray.100" }}
              position="relative"
            >
              <BellIcon fontSize="2xl" color="gray.600" />
              {notifications.length > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  position="absolute"
                  top="-1px"
                  right="-1px"
                  fontSize="0.7em"
                  px={2}
                  py={0.5}
                >
                  {notifications.length}
                </Badge>
              )}
            </MenuButton>

            <MenuList p={2} maxH="300px" overflowY="auto">
              {notifications.length === 0 ? (
                <Text color="gray.500" fontSize="sm" textAlign="center" p={2}>
                  No New Messages
                </Text>
              ) : (
                notifications.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotifications(notifications.filter((n) => n._id !== notif._id));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>

          {/* User Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={<ChevronDownIcon color="gray.600" />}
              p={1}
              borderRadius="full"
              _hover={{ bg: "gray.100" }}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem fontWeight="medium">{user?.name || "My Profile"}</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem color="red.500" onClick={logoutHandler}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {/* Search Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2} gap={2}>
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} colorScheme="teal">
                Go
              </Button>
            </Box>

            {loading ? (
              <Loading />
            ) : (
              searchResult?.map((searchedUser) => (
                <UserListItem
                  key={searchedUser._id}
                  user={searchedUser}
                  handleFunction={() => accessChat(searchedUser._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidedrawer;