import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Chats() {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/chats');
      console.log('Fetched chats data:', data);
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.name}</div>
      ))}
    </div>
  );
}

export default Chats;