import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../../context/chatprov';
import { Avatar, Tooltip, Box } from '@chakra-ui/react';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../../config/Chatlogics';
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            key={m._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: isSameUser(messages, m, i) ? '3px' : '10px',
            }}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={2}
                  size="xs"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            <Box
              as="span"
              bg={m.sender._id === user._id ? 'teal.500' : 'white'}
              color={m.sender._id === user._id ? 'white' : 'gray.800'}
              borderRadius={
                m.sender._id === user._id
                  ? '20px 20px 4px 20px'
                  : '20px 20px 20px 4px'
              }
              padding="8px 16px"
              maxW="75%"
              marginLeft={isSameSenderMargin(messages, m, i, user._id)}
              marginTop={isSameUser(messages, m, i, user._id) ? 1 : 2}
              boxShadow="0px 2px 5px rgba(0,0,0,0.05)"
              fontSize="14px"
              fontWeight="400"
              lineHeight="1.4"
            >
              {m.content}
            </Box>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;