import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, saveUserData } from '../firebase';
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
  TextField,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tabValue, setTabValue] = useState(0); // 0 for Sign In, 1 for Sign Up

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Successfully signed in:", result.user.email);
      // Save user data to Firestore
      await saveUserData(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Create the user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name if provided
      if (name) {
        await updateProfile(result.user, {
          displayName: name
        });
      }
      
      // Save user data to Firestore
      await saveUserData(result.user);
      
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError('Failed to sign up. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Update last login in Firestore
      await saveUserData(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Failed to sign in. Please try again later.');
      }
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
              {tabValue === 0 ? 'Sign in to access the chat' : 'Create a new account'}
            </Typography>

            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              sx={{ mb: 3, width: '100%' }}
              variant="fullWidth"
            >
              <Tab 
                label="Sign In" 
                icon={<LockOutlinedIcon />} 
                iconPosition="start"
              />
              <Tab 
                label="Sign Up" 
                icon={<PersonAddOutlinedIcon />} 
                iconPosition="start"
              />
            </Tabs>

            <Box component="form" sx={{ width: '100%' }}>
              {tabValue === 1 && (
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Your Name (optional)"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete={tabValue === 0 ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                onClick={tabValue === 0 ? handleEmailPasswordSignIn : handleEmailPasswordSignUp}
                sx={{ 
                  backgroundColor: '#232a3d',
                  '&:hover': {
                    backgroundColor: '#2c3548',
                  },
                  mb: 2,
                }}
              >
                {loading 
                  ? 'Processing...' 
                  : (tabValue === 0 ? 'Sign In' : 'Sign Up')}
              </Button>
            </Box>

            <Divider sx={{ width: '100%', my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              variant="contained"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={signInWithGoogle}
              disabled={loading}
              sx={{ 
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              {loading ? 'Processing...' : 'Continue with Google'}
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