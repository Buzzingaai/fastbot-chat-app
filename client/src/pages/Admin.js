import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../firebase';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// List of admin email addresses
const ADMIN_EMAILS = ['ali.moheyaldeen@gmail.com', 'ALI@BUZZINGA.AI'];

function Admin({ user }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if current user is an admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  // Fetch users on component mount
  useEffect(() => {
    let isMounted = true;
    
    // Only fetch if user is an admin
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }
    
    const fetchUsers = async () => {
      try {
        console.log("Fetching users data...");
        const userList = await getAllUsers();
        console.log("Fetched users:", userList);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setUsers(userList);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        if (isMounted) {
          setError("Failed to load user data.");
          setLoading(false);
        }
      }
    };

    fetchUsers();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [user, isAdmin]);

  // If not logged in, redirect to login
  if (!user) {
    return (
      <Box
        sx={{
          backgroundColor: '#232a3d',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Please log in to view the admin dashboard
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: '#232a3d',
              '&:hover': {
                backgroundColor: '#2c3548',
              },
            }}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }
  
  // If user is logged in but not an admin, show access denied
  if (!isAdmin) {
    return (
      <Box
        sx={{
          backgroundColor: '#232a3d',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Access Denied
          </Typography>
          <Typography sx={{ mb: 3 }}>
            You don't have permission to access the admin dashboard.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#232a3d',
              '&:hover': {
                backgroundColor: '#2c3548',
              },
            }}
          >
            Back to Chat
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#232a3d',
        minHeight: 'calc(100vh - 64px)',
        pt: 4,
        pb: 4,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: '#ffd700',
                color: '#ffd700',
              },
            }}
          >
            Back to Chat
          </Button>
          <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
            User Management
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <CircularProgress sx={{ color: '#232a3d' }} />
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Registered Users ({users.length})
              </Typography>

              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Sign-up Date</strong></TableCell>
                      <TableCell><strong>Last Login</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((userData) => (
                        <TableRow key={userData.uid}>
                          <TableCell>{userData.displayName || 'Anonymous'}</TableCell>
                          <TableCell>{userData.email}</TableCell>
                          <TableCell>{userData.createdAt ? new Date(userData.createdAt).toLocaleString() : 'N/A'}</TableCell>
                          <TableCell>{userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No users found in the database.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </Container>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Admin; 