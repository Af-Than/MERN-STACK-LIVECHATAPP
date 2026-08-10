// config/Chatlogics.js

// Returns the full user object of the other participant
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

// Returns just the name of the other participant
export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// Default export matching your current implementation
const Chatlogics = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export default Chatlogics;