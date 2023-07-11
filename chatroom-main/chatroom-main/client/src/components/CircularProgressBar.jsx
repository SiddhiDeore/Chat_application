import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function CircularProgressBar() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <CircularProgress color="success" />
    </Box>
  );
}

export default CircularProgressBar;
