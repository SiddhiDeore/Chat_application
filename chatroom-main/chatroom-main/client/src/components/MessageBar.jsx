import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/system';

const MessageBar = ({ onMessageChange, handleSubmit }) => {
  const [message, setMessage] = useState('');

  const onTextChange = (event) => {
    setMessage(event.target.value);
    onMessageChange();
  };

  const onSend = () => {
    handleSubmit(message);
  };

  return (
    <Stack direction={'row'} sx={{ padding: '1em' }}>
      <TextField
        variant="outlined"
        label="Enter your message"
        multiline
        value={message}
        onChange={onTextChange}
        sx={{ flexGrow: 2 }}
      />
      <IconButton
        size="large"
        color="success"
        onClick={() => {
          onSend();
          setMessage('');
        }}
        disabled={message.length === 0}
      >
        <SendIcon />
      </IconButton>
    </Stack>
  );
};

export default MessageBar;
