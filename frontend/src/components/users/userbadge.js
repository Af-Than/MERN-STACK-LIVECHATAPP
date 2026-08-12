import React from 'react';
import { Badge, Box, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

// Array of Chakra UI color schemes for dynamic selection
const COLOR_SCHEMES = [
  'purple',
  'teal',
  'pink',
  'blue',
  'orange',
  'cyan',
  'green',
  'red',
];

// Helper function to pick a consistent color based on user's ID
const getColorScheme = (id = '') => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_SCHEMES.length;
  return COLOR_SCHEMES[index];
};

const UserBadge = ({ user, handleFunction }) => {
  const colorScheme = getColorScheme(user._id || user.name);

  return (
    <Badge
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      px={3}
      py={1.5}
      borderRadius="full"
      m={1}
      variant="solid"
      colorScheme={colorScheme}
      fontSize="12px"
      fontWeight="600"
      textTransform="none"
      boxShadow="sm"
      transition="all 0.2s ease-in-out"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "md",
      }}
    >
      <Text isTruncated maxW="120px">
        {user.name}
      </Text>

      {/* Clean Close Icon Button */}
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
        p={0.5}
        transition="background 0.2s"
        _hover={{
          bg: "whiteAlpha.400",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleFunction(user);
        }}
        aria-label={`Remove ${user.name}`}
      >
        <CloseIcon w={2} h={2} color="white" />
      </Box>
    </Badge>
  );
};

export default UserBadge;