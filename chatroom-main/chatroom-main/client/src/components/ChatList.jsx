import { Box, List, ListItem, Stack } from '@mui/material';
import React from 'react';
import speak from '../images/speak.png'
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function EmptyChat({recipient}){
  return (<Box className='empty-chat'>
    <img src={speak} alt='chat' className='speak-image'/>
    <Box>{`Say hi👋 to ${recipient.name}`}</Box>
  </Box>)
}

function MessageAckonwlegment({chat}){
  if (chat.seen) return <DoneAllIcon sx={{color: 'green'}}/>
  else if (chat.recieved) return <DoneAllIcon/>
  else if (chat.sent) return <DoneIcon/>
}

function Chat({chat, recipient}){

  const toTime = (datetime) => {
     return new Date(datetime).toLocaleTimeString()
  }
  return (<Stack className={`chat ${chat.from === recipient._id ? 'recipient-chat': 'user-chat'}`}>
    <Box className='chat-message'>{chat.text}</Box>
    <Stack direction='row' sx={{width: '100%'}}>
    <Box>{toTime(chat.createdAt)}</Box>
    <Box sx={{marginLeft: 'auto'}}>{recipient._id !== chat.from && <MessageAckonwlegment chat={chat}/>}</Box>
    </Stack>
  </Stack>)
}


const ChatList = ({currentRecipient}) => {
  const {chats, recipient} = currentRecipient;
  if (!chats || chats.length === 0) return <EmptyChat recipient={recipient}/>
  return (
    <List className='chat-list'>
      {chats.map((chat) => {
        return <ListItem key={chat._id} className='chat-list-item'>
          <Chat chat={chat} recipient={recipient}/>
        </ListItem>
      })}
    </List>
  );
};


export default ChatList;
