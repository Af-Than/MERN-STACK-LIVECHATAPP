    import React, { useState } from 'react';
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
    } from '@chakra-ui/react';
    import axios from 'axios';
    import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
    import { useNavigate } from 'react-router-dom';
    import { ChatState } from '../../context/chatprov';
    import ProfileModel from './ProfileModel';
    import Loading from './Loading';
    import UserListItem from '../users/UserListItem'; // Corrected Import Path

    const Sidedrawer = () => {
    const { user, setSelectedChat, chats, setChats } = ChatState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();

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
        setSearchResult(data); // Populate the search result state
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

        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);//adding chats if its a new chat
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

            {/* App Name */}
            <Text
            fontSize="2xl"
            fontFamily="Work Sans"
            fontWeight="bold"
            letterSpacing="tight"
            color="teal.600"
            >
            ConvoHub
            </Text>

            {/* Right Action Icons */}
            <HStack spacing={3}>
            {/* Notifications Menu */}
            <Menu>
                <MenuButton
                as={Button}
                variant="ghost"
                p={2}
                borderRadius="full"
                _hover={{ bg: "gray.100" }}
                >
                <BellIcon fontSize="2xl" color="gray.600" />
                </MenuButton>
                <MenuList p={2}>
                <Text color="gray.500" fontSize="sm" textAlign="center">
                    No new notifications
                </Text>
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