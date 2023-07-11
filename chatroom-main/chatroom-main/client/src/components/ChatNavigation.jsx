import { Stack } from '@mui/system';
import { StatusCodes } from 'http-status-codes';
import React, { useState } from 'react';
import { CONTACTS_PATH, request } from '../server';
import AddUser from './AddUser';
import AddUserDialog from './AddUserDialog';
import ChatUsers from './ChatUsers';

const ChatNavigation = ({ onUserClick, users, socket }) => {
  const token = sessionStorage.token
  const [dialogOpen, setDialogOpen] = useState(false);

  const openAddUserDialog = () => {
    setDialogOpen(true);
  };

  const closeAddUserDialog = () => {
    setDialogOpen(false);
  };

  const onSubmit = async (phone) => {
    console.log(token)
    const response = await request.post(CONTACTS_PATH, {
      phone: phone,
    }, {
      headers: {
        authorization: token
      }
    });
    const statuscode = response.status;

    if (statuscode === StatusCodes.OK) setDialogOpen(false);
    else if (statuscode === StatusCodes.NOT_FOUND) alert('Contact not found');
    else if (statuscode === StatusCodes.BAD_REQUEST)
      alert('Contact already exists');
  };

  return (
    <Stack className="chat-navigation">
      <ChatUsers users={users} onChatUserClick={onUserClick} />
      <AddUser onClick={openAddUserDialog} />
      <AddUserDialog
        open={dialogOpen}
        handleClose={closeAddUserDialog}
        onSubmit={onSubmit}
      />
    </Stack>
  );
};

export default ChatNavigation;
