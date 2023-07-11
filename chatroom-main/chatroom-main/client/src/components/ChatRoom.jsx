import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import ChatScreen from './ChatScreen';
import io from 'socket.io-client';
import ChatNavigation from './ChatNavigation';
import Navigation from './Navigation';
import CircularProgressBar from './CircularProgressBar';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * chatUser = {
 * recipient,
 * chats,
 * chatId
 * }
 */

function ChatRoom() {
  const location = useLocation();
  const recipient = location.state;

  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [chatUsers, setChatUsers] = useState(null);
  const navigate = useNavigate();
  console.log(currentRecipient);

  // Fires when user sends a message to the current recipient
  const handleSubmit = (message) => {
    console.log(currentRecipient);
    console.log(currentRecipient.chatId);
    socket.emit('message', {
      text: message,
      to: currentRecipient.recipient._id,
      chatId: currentRecipient.chatId,
    });

  };

  const onMessageChange = () => {
  };

  const newChatUser = (chatId, currentChatUsers) => {
    console.log(currentChatUsers);
    return (
      currentChatUsers.findIndex((chatUser) => chatUser.chatId === chatId) ===
      -1
    );
  };

  const addNewChatUser = ({ message, chatId }) => {
    const modifiedChatUsers = [...chatUsers];
    const newChatUser = {
      chatId: chatId,
      recipient: currentRecipient.recipient,
      chats: [message],
    };
    modifiedChatUsers.push(newChatUser);
    setCurrentRecipient(newChatUser);
    return modifiedChatUsers;
  };

  const onChatUserClick = (unreadMessages, recipientid) => {
    const currentRecipientIndex = chatUsers.findIndex(
      (chatUser) => chatUser.recipient._id === recipientid
    );
    setCurrentRecipient(chatUsers[currentRecipientIndex]);
    const seenMessages = [];

    if (unreadMessages > 0) {
      const modifiedChatusers = chatUsers.map((chatUser, index) => {
        if (index === currentRecipientIndex) {
          const recipientChats = [...chatUser.chats];
          console.log(recipientChats);
          for (
            let i = recipientChats.length - unreadMessages;
            i < recipientChats.length;
            i++
          ) {
            const chat = { ...recipientChats[i], seen: true };
            recipientChats[i] = chat;
            seenMessages.push(chat);
          }
          return { ...chatUser, chats: recipientChats };
        }
        return chatUser;
      });
      socket.emit('seen', seenMessages);
      setChatUsers(modifiedChatusers);
    }
  };

  const onMessageSentAcknowledegement = (data) => {
    const { message, chatId } = data;
    let modifiedChatUsers = [];

    if (newChatUser(chatId, chatUsers)) {
      console.log(currentRecipient)
      modifiedChatUsers = addNewChatUser(data);
    } else {
      modifiedChatUsers = chatUsers.map((chatUser) => {
        if (chatUser.chatId === chatId) {
          const chats = [...chatUser.chats];
          chats.push(message);
          const modifiedRecipient = { ...chatUser, chats: chats };

          if (currentRecipient.recipient._id === chatUser.recipient._id) {
            setCurrentRecipient(modifiedRecipient);
          }
          return modifiedRecipient;
        }
        return chatUser;
      });
    }
    console.log(modifiedChatUsers);
    setChatUsers(modifiedChatUsers);
  };

  const onMessageSeen = ({ chatIds, recipientId }) => {
    const messageRecipient = {
      ...chatUsers.find((chatUser) => chatUser.recipient._id === recipientId),
    };

    console.log(messageRecipient);
    const messageRecipientChats = messageRecipient.chats.map((chat) => {
      const chatId = chat._id;
      if (chatIds.includes(chatId)) return { ...chat, seen: true };
      return chat;
    });

    const modifiedChatUsers = chatUsers.map((chatUser) => {
      return chatUser.recipient._id === messageRecipient.recipient._id
        ? chatUser
        : {
            ...messageRecipient,
            chats: messageRecipientChats,
          };
    });
    setChatUsers(modifiedChatUsers);
  };

  const onNewMessage = ({ message, chatId }) => {
    const newChat = newChatUser(chatId, chatUsers);
    const recipient = message.from;
    let modifiedChats = [];

    if (newChat) {
      modifiedChats = [...chatUsers];
      modifiedChats.push({
        recipient: {
          ...recipient,
          isOnline: true,
        },
      });
    } else {
      modifiedChats = chatUsers.map((chatUser) => {
        if (chatUser.chatId === chatId) {
          const onScreen = currentRecipient.chatId === chatId;
          const chats = [...chatUser.chats];
          message.seen = onScreen;
          chats.push(message);
          socket.emit('seen', [message]);

          const modifiedChatUser = {
            ...chatUser,
            chats: chats,
          };
          if (onScreen) setCurrentRecipient(modifiedChatUser);
          return modifiedChatUser;
        }
        return chatUser;
      });
    }
    setChatUsers(modifiedChats);
  };

  const toggleUserOnlineStatus = (online, userId) => {
    const modifiedUsers = chatUsers.map((chatUser) => {
      if (chatUser.recipient._id === userId) {
        chatUser.recipient.isOnline = online;
        return chatUser;
      }
      return chatUser;
    });
    setChatUsers(modifiedUsers);
  };

  // When one of the
  const onChatUserOnline = (userId) => {
    const recipient = {
      ...chatUsers.find((chatUser) => chatUser.recipient._id === userId),
    };

    const modifiedUsers = chatUsers.map((chatUser) => {
      if (chatUser.recipient._id === userId) {
        const chats = recipient.chats.map((chat) => {
          return { ...chat, recieved: true };
        });
        const modifiedChatUser = { chatUser, chats: chats };
        if (modifiedChatUser.chatId === currentRecipient.chatId) {
          setCurrentRecipient(modifiedChatUser);
        }
      }
      return chatUser;
    });

    setChatUsers(modifiedUsers);
  };
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return navigate('/login');
    const newSocket = io(`http://${window.location.hostname}:4000`, {
      auth: {
        token: token,
      },
    });
    setSocket(newSocket);

    newSocket.on('chats', (data) => {
      const { chats, user } = data;
      console.log(chats);
      if (recipient) {
        const recipientFound = chats.find(
          (chat) => chat.recipient._id === recipient._id
        );
        if (!recipientFound) {
          setCurrentRecipient({
            chats: [],
            recipient: recipient,
            chatId: null,
          });
        } else {
          setCurrentRecipient(recipientFound);
        }
      }
      setChatUsers(chats);
      setUser(user);
    });

    newSocket.on('message-acknowledged', (data) => {
      onMessageSentAcknowledegement(data);
    });

    newSocket.on('new-message', (message) => {
      alert('new-messaage');
      onNewMessage(message);
    });

    newSocket.on('message-seen', (message) => {
      alert('message-seen')
      onMessageSeen(message);
    });

    newSocket.on('online', ({ userId }) => {
      toggleUserOnlineStatus(true, userId);
      onChatUserOnline(userId);
    });

    newSocket.on('offline', ({ userId }) => {
      toggleUserOnlineStatus(false, userId);
    });
    return () => newSocket.close();
  }, []);

  if (chatUsers === null) return <CircularProgressBar />;
  return (
    <Stack spacing={1}>
      <Navigation user={user} socket={socket} />
      <Stack direction="row" spacing={2} className="chatroom">
        <ChatNavigation users={chatUsers} onUserClick={onChatUserClick} />
        <ChatScreen
          handleSubmit={handleSubmit}
          onMessageChange={onMessageChange}
          currentRecipient={currentRecipient}
        />
      </Stack>
    </Stack>
  );
}

export default ChatRoom;
