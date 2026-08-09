import React from 'react'
import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import {useState} from 'react'
import { Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Sidedrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
  return (
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
    >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
            <Button variant='ghost' onClick={onOpen}>
                <i class="fa-brands fa-searchengin"></i>
                <Text display={{base:"none",md:"flex"}} px={4} py={1} borderRadius="lg" _hover={{cursor:"pointer",backgroundColor:"gray.100"}}>
                    Search user
                </Text>
            </Button>
        </Tooltip>
    </Box>
  )
}

export default Sidedrawer