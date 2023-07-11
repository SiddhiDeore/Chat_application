import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

function AddUserDialog({ open, handleClose, onSubmit }) {
  const [ phone, setPhone ] = useState('');

  const validatePhone = () => {
    return phone.length === 10;
  };

  const onPhoneChange = (event) => {
    setPhone(event.target.value);
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ height: '500px' }}>
      <DialogTitle>Add new contact</DialogTitle>
      <DialogContent>
        <TextField
          value={phone}
          onChange={onPhoneChange}
          label="Enter contact phone"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onSubmit(phone)
          }}
          disabled={!validatePhone()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddUserDialog;
