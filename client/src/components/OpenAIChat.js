import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  IconButton,
  CircularProgress,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { sendMessageToOpenAI, startNewChat, loadKnowledgeBase } from '../services/openaiService';

const OpenAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [knowledgeFiles, setKnowledgeFiles] = useState([]);
  const [selectedKnowledge, setSelectedKnowledge] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (input.trim() === '') return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to chat
    setMessages(prevMessages => [
      ...prevMessages,
      { text: userMessage, isUser: true }
    ]);

    try {
      // Send to OpenAI with active knowledge base
      const knowledgeText = selectedKnowledge 
        ? knowledgeFiles.find(kf => kf.name === selectedKnowledge)?.content || ''
        : '';
        
      const response = await sendMessageToOpenAI(userMessage, knowledgeText);
      
      // Add bot response to chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: response, isUser: false }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Sorry, there was an error processing your request.', isUser: false, isError: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    startNewChat();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const content = await loadKnowledgeBase(file);
      
      // Add to knowledge files
      setKnowledgeFiles(prev => [
        ...prev, 
        { name: file.name, content }
      ]);
      
      // Set as selected
      setSelectedKnowledge(file.name);
      
      // Reset file input
      e.target.value = null;
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    }
  };

  const handleKnowledgeChange = (e) => {
    setSelectedKnowledge(e.target.value);
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        height: '600px', 
        width: '100%', 
        maxWidth: '800px', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: '#232a3d', 
          color: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6">
          <span style={{ color: 'white' }}>BUZZING</span>
          <span style={{ color: '#ffd700' }}>A</span>
          <span style={{ fontSize: '0.8em', marginLeft: '8px' }}>powered by OpenAI</span>
        </Typography>
        <Box>
          <IconButton 
            size="small" 
            onClick={() => fileInputRef.current.click()} 
            title="Upload knowledge base"
            sx={{ color: 'white', mr: 1 }}
          >
            <UploadFileIcon />
          </IconButton>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".txt,.md,.json"
            onChange={handleFileUpload}
          />
          <IconButton 
            size="small" 
            onClick={handleClearChat} 
            title="Clear chat"
            sx={{ color: 'white' }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Knowledge base selector */}
      {knowledgeFiles.length > 0 && (
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #eee' }}>
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Knowledge Base</InputLabel>
            <Select
              value={selectedKnowledge}
              onChange={handleKnowledgeChange}
              label="Knowledge Base"
            >
              <MenuItem value="">
                <em>None (General Knowledge)</em>
              </MenuItem>
              {knowledgeFiles.map(kf => (
                <MenuItem key={kf.name} value={kf.name}>
                  {kf.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Messages area */}
      <Box 
        sx={{ 
          p: 2, 
          flexGrow: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.length === 0 ? (
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Typography color="text.secondary" align="center">
              أرسل رسالة للبدء في الدردشة مع بوزنجا
              {selectedKnowledge && 
                <Chip 
                  size="small" 
                  label={`يستخدم: ${selectedKnowledge}`} 
                  sx={{ ml: 1 }} 
                />
              }
            </Typography>
          </Box>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                backgroundColor: msg.isUser 
                  ? '#1976d2' 
                  : msg.isError 
                    ? '#ffebee' 
                    : '#f5f5f5',
                color: msg.isUser ? 'white' : 'black',
                borderRadius: 2,
                px: 2,
                py: 1,
                maxWidth: '80%',
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
            </Box>
          ))
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Divider />
      <Box 
        component="form" 
        onSubmit={handleSendMessage}
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="اكتب سؤالك هنا..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={loading || input.trim() === ''}
          sx={{ 
            backgroundColor: '#232a3d',
            '&:hover': {
              backgroundColor: '#2c3548',
            },
          }}
        >
          إرسال
        </Button>
      </Box>
    </Paper>
  );
};

export default OpenAIChat;
