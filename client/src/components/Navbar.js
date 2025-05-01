import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#232a3d' }}>
      <Toolbar>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '1px',
          }}
        >
          <span style={{ color: 'white' }}>BUZZINGA</span>
          <span style={{ color: '#ffd700' }}>A</span>
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {user.email}
            </Typography>
            <Button color="inherit" onClick={handleSignOut} sx={{ color: 'white' }}>
              Sign Out
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 