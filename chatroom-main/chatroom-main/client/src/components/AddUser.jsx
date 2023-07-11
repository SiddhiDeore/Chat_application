import React from 'react'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { SpeedDial } from '@mui/material';

function AddUser({onClick}){
    return (
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 10 }}
        icon={<PersonAddAlt1Icon />}
        onClick={onClick}
      ></SpeedDial>
    );
}

export default AddUser;