import React from 'react';
import { Container, Box, Paper } from '@mui/material';

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
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#232a3d',
            border: '1px solid #aaa',
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
              style={{ width: '400px', height: '600px', border: 'none' }}
              src="https://app.fastbots.ai/embed/cm8wnu3fg0gs6rik6m5aojjvl"
              title="Buzzinga Chat"
              frameBorder="0"
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Chat; 