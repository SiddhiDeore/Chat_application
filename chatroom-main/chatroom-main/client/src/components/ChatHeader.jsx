import React from 'react';
import { Avatar, Box, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Stack from '@mui/material/Stack';

const ChatHeader = ({ username }) => {
  return (
    <Stack direction="row" alignItems="center" sx={{ padding: '0.85em' }}>
      <Avatar sx={{ height: '40px', width: '40px' }}>
        {username[0].toUpperCase()}
      </Avatar>
      <Box sx={{ flexGrow: 1, paddingLeft: '1em' }}>{username}</Box>
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    </Stack>
  );
};

export default ChatHeader;
