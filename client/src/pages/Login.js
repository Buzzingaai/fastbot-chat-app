import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Successfully signed in:", result.user.email);
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#232a3d',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography 
            component="h1" 
            variant="h3" 
            sx={{ 
              mb: 5, 
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '1px',
              color: 'white',
            }}
          >
            <span style={{ color: 'white' }}>BUZZINGA</span>
            <span style={{ color: '#ffd700' }}>A</span>
          </Typography>
          
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 2,
            }}
          >
            <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
              Sign in to access the chat
            </Typography>
            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={signInWithGoogle}
              disabled={loading}
              sx={{ 
                width: '100%',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </Paper>
        </Box>
        
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Login; 