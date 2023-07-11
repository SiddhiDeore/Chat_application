import React from 'react';
import ChatHeader from './ChatHeader';
import MessageBar from './MessageBar';
import ChatList from './ChatList';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import chat from '../images/chat.png';
import { Typography } from '@mui/material';

function NoChat() {
  return (
    <Stack
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <img src={chat} alt="logo" />
      <Typography variant="h6">Start Chatting 🫡🫡</Typography>
    </Stack>
  );
}

const ChatScreen = ({ handleSubmit, onMessageChange, currentRecipient }) => {
  console.log(currentRecipient);
  return (
    <Stack className="chat-area">
      {currentRecipient ? (
        <>
          <ChatHeader
            username={currentRecipient.recipient.name}
            onlinestatus={currentRecipient.recipient.isOnline}
          />
          <Divider variant="middle" />
          <ChatList currentRecipient={currentRecipient} />
          <MessageBar
            handleSubmit={handleSubmit}
            onMessageChange={onMessageChange}
          />{' '}
        </>
      ) : (
        <NoChat />
      )}
    </Stack>
  );
};

export default ChatScreen;
