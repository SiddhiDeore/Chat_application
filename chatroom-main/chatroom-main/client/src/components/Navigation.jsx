import { Stack, IconButton, Box, Avatar } from '@mui/material';
import React from 'react';
import chat from '../images/chat.png';
import { useNavigate } from 'react-router-dom';

const AppIcon = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      onClick={() => {
        navigate('/');
      }}
    >
      <img src={chat} className="app-logo" alt="chat" />
    </IconButton>
  );
};

const Navigation = ({ user, socket }) => {
  const navigate = useNavigate();
  const navigateToUserProfile = () => {
    socket.close();
    navigate('/profile');
  };

  return (
    <Stack className="nav" direction="row">
      <AppIcon />
      <Box className="app-title" sx={{ flexGrow: 1 }}>
        ChatRoom
      </Box>
      <IconButton onClick={navigateToUserProfile}>
        <Avatar sx={{ backgroundColor: 'black' }}>
          {user.name[0].toUpperCase()}
        </Avatar>
      </IconButton>
    </Stack>
  );
};

export default Navigation;
