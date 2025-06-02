import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Alert,
  CircularProgress,
  Input
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function PhotoUpload({ loggedInUser }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        setMessageType('error');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setMessage('File size must be less than 10MB');
        setMessageType('error');
        return;
      }

      setSelectedFile(file);
      setMessage('');
      setMessageType('');
    }
  };

  // Handle photo upload
  const handleUpload = async () => {
    console.log('Selected file:', selectedFile); // Debug log

    if (!selectedFile) {
      setMessage('Please select a photo to upload');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      console.log('FormData created, uploading to:', '/api/photos/new'); // Debug log

      // Fixed: Use the correct endpoint that matches your backend router
      const response = await fetch('https://lnmx2d-8081.csb.app/api/photos/new', {
        method: 'POST',
        credentials: 'include', // Important: Include credentials for session
        body: formData,
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response ok:', response.ok); // Debug log

      if (response.ok) {
        const result = await response.json();
        console.log('Upload success:', result); // Debug log
        setMessage('Photo uploaded successfully!');
        setMessageType('success');
        setSelectedFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('photo-upload-input');
        if (fileInput) fileInput.value = '';

        // Navigate to user photos page after 2 seconds
        setTimeout(() => {
          navigate(`/photos/${loggedInUser._id}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        console.log('Upload error data:', errorData); // Debug log
        setMessage(errorData.error || 'Failed to upload photo');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Upload error:', error); // Debug log
      setMessage('An error occurred while uploading the photo');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (!loggedInUser) {
    return (
      <div className="photo-upload-container">
        <Paper elevation={3} className="photo-upload-paper">
          <Typography variant="h5" gutterBottom>
            Please log in to upload photos
          </Typography>
        </Paper>
      </div>
    );
  }

  return (
    <div className="photo-upload-container">
      <Paper elevation={3} className="photo-upload-paper">
        <Typography variant="h4" gutterBottom>
          Upload New Photo
        </Typography>

        {message && (
          <Alert 
            severity={messageType} 
            sx={{ mb: 2 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <Box className="upload-section">
          <Input
            id="photo-upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            sx={{ mb: 2 }}
          />

          {selectedFile && (
            <Box className="file-preview">
              <Typography variant="body2" color="textSecondary">
                Selected file: {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          )}

          <Box className="button-section">
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : null}
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>

            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={uploading}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default PhotoUpload;