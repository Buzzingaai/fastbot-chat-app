import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, getAllUsers } from '../firebase';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar({ user }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // For demo purposes, defining admin access
  // The first registered user or specific email addresses can be admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const adminEmails = ['admin@example.com']; // Add your admin email
          
          // Check if user email is in admin list
          if (adminEmails.includes(user.email)) {
            setIsAdmin(true);
            return;
          }
          
          // Or check if this is the first registered user
          const users = await getAllUsers();
          if (users.length === 1) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };
    
    checkAdminStatus();
  }, [user]);

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
          <span style={{ color: 'white' }}>BUZZINGA</span>
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