import React, { useState } from 'react';
import Stack from '@mui/system/Stack';
import { Box, Button, TextField } from '@mui/material';
import chat from '../images/chat.png';
import { AUTH_PATH, request } from '../server';
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import jwt_decode from 'jwt-decode';

function validatePhone(phone) {
  return phone.match(/^\d{10}$/);
}

function validatePassword(password) {
  return password.match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  );
}

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = () => {
    if (!validatePhone(phone)) {
      console.log('invalid phone');
      alert('Invalid phone');
    } else {
      const userSignIn = async () => {
        const response = await request.post(`${AUTH_PATH}/signin`, {
          phone: phone,
          password: password,
        });
        const statuscode = response.status;
        console.log(response.data);

        if (statuscode === StatusCodes.BAD_REQUEST)
          alert("Phone and password doesn't match");
        else if (statuscode === StatusCodes.OK) {
          const token = response.data.token;
          sessionStorage.setItem('token', token);

          const decodedToken = jwt_decode(token);
          if (decodedToken.completeProfile) navigate('/');
          else navigate('/completeprofile');
        }
      };

      userSignIn();
    }
  };

  return (
    <Stack direction="row" sx={{ width: '100%', height: '100vh' }}>
      <Stack
        sx={{ backgroundColor: '', flexGrow: 1 }}
        alignItems="center"
        justifyContent="center"
        spacing={2}
        className='login-box'
      >
        <Box>Welcome abroad Join the community 😀</Box>
        <TextField
          value={phone}
          label="phone"
          onChange={(event) => {
            setPhone(event.target.value);
          }}
        />

        <TextField
          value={password}
          label="password"
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <Button variant="contained" onClick={onSubmit} color="success">
          SIGN IN
        </Button>
      </Stack>
      <Box
        sx={{
          flexGrow: 2,
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '30px',
            height: '90%',
            width: '90%',
            background: '#fff2df',
          }}
        >
          <Box textAlign={'center'} className='login-app-title'>CHAT-ROOM</Box>
          <img src={chat} alt="application icon"></img>
        </Stack>
      </Box>
    </Stack>
  );
}

export default Login;
