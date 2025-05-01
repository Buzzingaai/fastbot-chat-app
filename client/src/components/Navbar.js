import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// List of admin email addresses
const ADMIN_EMAILS = ['ali.moheyaldeen@gmail.com', 'ALI@BUZZINGA.AI'];

function Navbar({ user }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Check if current user is an admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleAdminClick = () => {
    handleClose();
    navigate('/admin');
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
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <span style={{ color: 'white' }}>BUZZING</span>
          <span style={{ color: '#ffd700' }}>A</span>
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {user.email}
            </Typography>
            
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              {isAdmin && (
                <MenuItem onClick={handleAdminClick}>
                  <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1 }} />
                  Admin Dashboard
                </MenuItem>
              )}
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 