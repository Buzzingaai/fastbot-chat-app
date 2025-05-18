import React from 'react';
import { Container, Box } from '@mui/material';
import OpenAIChat from '../components/OpenAIChat';

function Chat() {
  return (
    <Box
      sx={{
        backgroundColor: '#232a3d',
        minHeight: 'calc(100vh - 64px)',
        pt: 4,
        pb: 4,
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <OpenAIChat />
      </Container>
    </Box>
  );
}

export default Chat; 