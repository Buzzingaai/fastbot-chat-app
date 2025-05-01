import React from 'react';
import { Container, Box, Paper } from '@mui/material';

function Chat() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '600px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <iframe
            style={{ width: '400px', height: '600px' }}
            src="https://app.fastbots.ai/embed/cm8wnu3fg0gs6rik6m5aojjvl"
            title="FastBot Chat"
            frameBorder="0"
          />
        </Box>
      </Paper>
    </Container>
  );
}

export default Chat; 