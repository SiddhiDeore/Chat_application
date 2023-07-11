import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React from 'react';
import { useState } from 'react';

const OtpDialog = ({ showDialog }) => {
  const [otp, setOtp] = useState('');
  return (
    <Dialog open={showDialog}>
      <DialogTitle>ENTER OTP</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="otp"
          fullWidth
          variant="outlined"
          value={otp}
          onChange={(event) => {
            setOtp(event.target.value);
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button></Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpDialog;
