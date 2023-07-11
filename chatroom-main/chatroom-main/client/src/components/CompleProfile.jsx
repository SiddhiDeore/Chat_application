import { Avatar, Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { green } from '@mui/material/colors';
import { request } from '../server';
import { useNavigate } from 'react-router-dom';

function CompleteProfile() {
  const [username, setUserName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await request.put(`profile/complete`, {
      name: username,
    }, {
      headers: {
        authorization: sessionStorage.token
      }
    });
    const { token } = response.data;
    sessionStorage.setItem('token', token);
    return navigate('/', {replace: true});
  };

  return (
    <Stack className="complete-profile" spacing={2}>
      <Avatar sx={{ bgcolor: green[500], height: 250, width: 250 }}>
        <PersonIcon sx={{ fontSize: '100px' }} />
      </Avatar>
      <TextField
        fullWidth
        label="Enter your name"
        variant="outlined"
        value={username}
        sx={{width: '70%'}}
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
      <Button
        variant="contained"
        disabled={username.length === 0}
        color={'success'}
        onClick={handleSubmit}
      >
        Complete Profile
      </Button>
    </Stack>
  );
}

export default CompleteProfile;
