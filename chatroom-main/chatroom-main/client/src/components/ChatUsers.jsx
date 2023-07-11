import {
  Avatar,
  Stack,
  Box,
  List,
  ListItem,
  Badge,
  Divider,
} from '@mui/material';
import React from 'react';

function ChatUser({ chatUser, onChatUserClick }) {
  console.log(chatUser);
  const lastmessage = chatUser.chats[chatUser.chats.length - 1];
  const unreadMessages = chatUser.chats.filter((chat) => {
    return !chat.seen && chat.from === chatUser.recipient._id;
  }).length;

  const { name, isOnline } = chatUser.recipient;
  return (
    <Stack
      direction={'row'}
      className="chat-user"
      spacing={2}
      onClick={() => {
        onChatUserClick(unreadMessages, chatUser.recipient._id);
      }}
    >
      <Box>
        <Badge
          variant="dot"
          color="success"
          invisible={!isOnline}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Avatar
            className="chat-user-avatar"
            sx={{ height: '50px', width: '50px' }}>
            {name[0].toUpperCase()}
          </Avatar>
        </Badge>
      </Box>
      <Stack sx={{ flexGrow: 1 }}>
        <Box className="chat-user-name">{name}</Box>
        <Box className="newest-message">{lastmessage.text}</Box>
      </Stack>
      <Box>
        <Box className="chat-user-message-time">{new Date(lastmessage.createdAt).toLocaleTimeString()}</Box>
        {unreadMessages > 0 ? <Box className="chat-user-new-messages">{unreadMessages}</Box> : <></>}
      </Box>
    </Stack>
  );
}

const ChatUsers = ({ users, onChatUserClick }) => {
  console.log(users);
  return (
    <List className="chat-user-list">
      {users.map((user) => {
        console.log(user);
        return (
          <>
            <ListItem key={user.recipient._id}>
              <ChatUser chatUser={user} onChatUserClick={onChatUserClick} />
            </ListItem>
            <Divider variant="middle" />
          </>
        );
      })}
    </List>
  );
};

export default ChatUsers;
