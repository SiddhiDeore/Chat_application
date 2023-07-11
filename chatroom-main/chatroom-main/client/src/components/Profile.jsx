import {
  Avatar,
  Stack,
  Box,
  List,
  ListItem,
  Divider,
  Badge,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../server';
import CircularProgressBar from './CircularProgressBar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import Navigation from './Navigation';


function ProfileAttribute({ Icon, name, value }) {
  return (
    <Stack className="profile-attribute" direction={'row'} spacing={1}>
      <Icon
        className="profile-attribute-icon"
        style={{ fontSize: '50px', color: '#696969' }}
      />
      <Stack>
        <Box className="profile-attribute-name">{name}</Box>
        <Box className="profile-attribute-value">{value}</Box>
      </Stack>
    </Stack>
  );
}

function Contact({ contact, onClick }) {
  return (
    <Stack
      direction={'row'}
      spacing={2}
      onClick={() => {
        onClick(contact);
      }}
      className="contact"
    >
      <Badge
        variant="dot"
        color="success"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        invisible={!contact.isOnline}
      >
        <Avatar sx={{ height: '50px', width: '50px' }}>
          {contact.name[0].toUpperCase()}
        </Avatar>
      </Badge>
      <Box>
        <Box className="contact-name">{contact.name}</Box>
        <Box>{contact.phone}</Box>
      </Box>
    </Stack>
  );
}


function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const onContactClick = (contact) => {
    navigate('/', {
      replace: true,
      state: contact,
    });
  };

  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const fetchUserDetails = async () => {
      const response = await request.get('/profile', {
        headers: {
          authorization: token,
        },
      });
      const userData = response.data;
      console.log(userData);
      setUser(userData);
    };
    fetchUserDetails();
  }, []);

  if (!user) return <CircularProgressBar />;
  else
    return (
      <>
        <Navigation user={user.profile} />
        <Stack direction={'row'} spacing={2} className="profile-page">
          <Stack className="profile-tab">
            <Avatar
              sx={{
                height: '200px',
                width: '200px',
                fontSize: '100px',
                marginBottom: '0.3em',
                background: 'black'
              }}
            >
              {user.profile.name[0].toUpperCase()}
            </Avatar>
            <ProfileAttribute
              name={'Name'}
              value={user.profile.name}
              Icon={PersonIcon}
            />
            <Divider variant="middle" />
            <ProfileAttribute
              name={'Phone'}
              value={user.profile.phone}
              Icon={PhoneIcon}
            />
            <Divider variant="middle" />
            <ProfileAttribute
              name={'Joined On'}
              value={new Date(user.profile.createdAt).toLocaleDateString()}
              Icon={AccessTimeIcon}
            />
          </Stack>

          <Stack className="contact-tab">
            <Box className="contacts-heading">Contacts</Box>
            <List className="contact-list">
              {user.contacts.map((contact) => {
                return (
                  <ListItem>
                    <Contact contact={contact} onClick={onContactClick} />
                    <Divider variant="middle" />
                  </ListItem>
                );
              })}
            </List>
          </Stack>
        </Stack>
      </>
    );
}

export default Profile;
