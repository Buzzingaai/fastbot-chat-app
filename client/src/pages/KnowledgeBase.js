import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  TextField, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

// List of admin email addresses
const ADMIN_EMAILS = ['ali.moheyaldeen@gmail.com', 'ALI@BUZZINGA.AI'];

function KnowledgeBase({ user }) {
  const navigate = useNavigate();
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadDialog, setUploadDialog] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [textContent, setTextContent] = useState('');
  
  // Check if current user is an admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  // Fetch knowledge bases from Firestore
  useEffect(() => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }
    
    const fetchKnowledgeBases = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'knowledge_bases'));
        const bases = [];
        querySnapshot.forEach((doc) => {
          bases.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setKnowledgeBases(bases);
      } catch (err) {
        console.error('Error fetching knowledge bases:', err);
        setError('Failed to load knowledge bases.');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBases();
  }, [user, isAdmin]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleFileRead = (e) => {
    const content = e.target.result;
    setTextContent(content);
  };

  const handleUploadOpen = () => {
    setUploadDialog(true);
  };

  const handleUploadClose = () => {
    setUploadDialog(false);
    setFileToUpload(null);
    setTitle('');
    setDescription('');
    setTextContent('');
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      setError('Please provide a title');
      return;
    }

    if (!fileToUpload && !textContent.trim()) {
      setError('Please upload a file or enter text content');
      return;
    }

    setLoading(true);
    
    try {
      let content = textContent;
      
      // If a file was uploaded, read its contents
      if (fileToUpload) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          content = e.target.result;
          await saveToFirestore(title, description, content, fileToUpload.name);
        };
        reader.readAsText(fileToUpload);
      } else {
        // Save directly if text was entered
        await saveToFirestore(title, description, content, 'Direct Entry');
      }
    } catch (err) {
      console.error('Error uploading knowledge base:', err);
      setError('Failed to upload knowledge base');
      setLoading(false);
    }
  };

  const saveToFirestore = async (title, description, content, source) => {
    try {
      const docRef = await addDoc(collection(db, 'knowledge_bases'), {
        title,
        description,
        content,
        source,
        createdAt: new Date().toISOString(),
        createdBy: user.email
      });
      
      setKnowledgeBases(prev => [...prev, {
        id: docRef.id,
        title,
        description,
        source,
        createdAt: new Date().toISOString(),
        createdBy: user.email
      }]);
      
      setSuccess('Knowledge base uploaded successfully');
      handleUploadClose();
    } catch (err) {
      console.error('Error saving to Firestore:', err);
      setError('Failed to save knowledge base');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'knowledge_bases', selectedItem.id));
      setKnowledgeBases(prev => prev.filter(kb => kb.id !== selectedItem.id));
      setSuccess('Knowledge base deleted successfully');
    } catch (err) {
      console.error('Error deleting knowledge base:', err);
      setError('Failed to delete knowledge base');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  // If not logged in or not an admin, show access denied
  if (!user || !isAdmin) {
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
            You don't have permission to access the knowledge base management.
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
            العودة إلى الدردشة
          </Button>
          <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
            إدارة قاعدة المعرفة
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              قواعد المعرفة الخاصة بك
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleUploadOpen}
              sx={{ 
                backgroundColor: '#232a3d',
                '&:hover': {
                  backgroundColor: '#2c3548',
                },
              }}
            >
              إضافة جديد
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {knowledgeBases.length > 0 ? (
                knowledgeBases.map((kb, index) => (
                  <React.Fragment key={kb.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(kb)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={kb.title}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Source: {kb.source}
                            </Typography>
                            {kb.description && (
                              <Typography
                                component="p"
                                variant="body2"
                                color="text.secondary"
                              >
                                {kb.description}
                              </Typography>
                            )}
                            <Typography
                              component="p"
                              variant="body2"
                              color="text.secondary"
                            >
                              Added: {new Date(kb.createdAt).toLocaleString()}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No knowledge bases found. Add one to get started.
                  </Typography>
                </Box>
              )}
            </List>
          )}
        </Paper>
      </Container>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={handleUploadClose} maxWidth="md" fullWidth>
        <DialogTitle>إضافة قاعدة معرفة جديدة</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            قم بتحميل ملف نصي أو قم بإدخال المحتوى مباشرة لقاعدة المعرفة الخاصة بك.
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            label="العنوان"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="الوصف (اختياري)"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              تحميل ملف
              <input
                type="file"
                hidden
                accept=".txt,.md,.html"
                onChange={handleFileChange}
              />
            </Button>
            {fileToUpload && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                تم اختيار: {fileToUpload.name}
              </Typography>
            )}
          </Box>
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            أو أدخل المحتوى مباشرة:
          </Typography>
          <TextField
            label="المحتوى"
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadClose}>إلغاء</Button>
          <Button 
            onClick={handleUpload} 
            variant="contained"
            disabled={loading}
            sx={{ 
              backgroundColor: '#232a3d',
              '&:hover': {
                backgroundColor: '#2c3548',
              },
            }}
          >
            {loading ? 'جاري التحميل...' : 'تحميل'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default KnowledgeBase; 