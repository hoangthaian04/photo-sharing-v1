import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [commentSuccess, setCommentSuccess] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data for userId:', userId); // Debug log
      
      // Fetch user details
      const userData = await fetchModel(`/api/user/${userId}`);
      console.log('User data:', userData); // Debug log
      setUser(userData);

      // Fetch photos of user
      const photosData = await fetchModel(`/api/photo/photosOfUser/${userId}`);
      console.log('Photos data:', photosData); // Debug log
      
      // Đảm bảo photosData là array
      if (Array.isArray(photosData)) {
        setPhotos(photosData);
      } else {
        console.warn('Photos data is not an array:', photosData);
        setPhotos([]);
      }
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setPhotos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, location.key]); // Refetch when userId changes or when navigating back

  // Handle comment text change
  const handleCommentChange = (photoId, value) => {
    setNewComments(prev => ({
      ...prev,
      [photoId]: value
    }));
    
    // Clear messages when user starts typing
    if (commentErrors[photoId]) {
      setCommentErrors(prev => ({
        ...prev,
        [photoId]: null
      }));
    }
    if (commentSuccess[photoId]) {
      setCommentSuccess(prev => ({
        ...prev,
        [photoId]: null
      }));
    }
  };

  // Submit new comment
  const handleSubmitComment = async (photoId) => {
    const commentText = newComments[photoId]?.trim();
    
    if (!commentText) {
      setCommentErrors(prev => ({
        ...prev,
        [photoId]: "Comment cannot be empty"
      }));
      return;
    }

    setLoadingComments(prev => ({
      ...prev,
      [photoId]: true
    }));

    try {
      // Use correct API endpoint
      const response = await fetch(`https://sfk4vy-8081.csb.app/api/comment/commentsOfPhoto/${photoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ comment: commentText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      const result = await response.json();
      
      // Update the photos state to include the new comment
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => {
          if (photo._id === photoId) {
            return {
              ...photo,
              comments: [...(photo.comments || []), result.comment]
            };
          }
          return photo;
        })
      );

      // Clear the input and show success message
      setNewComments(prev => ({
        ...prev,
        [photoId]: ''
      }));
      
      setCommentSuccess(prev => ({
        ...prev,
        [photoId]: "Comment added successfully!"
      }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setCommentSuccess(prev => ({
          ...prev,
          [photoId]: null
        }));
      }, 3000);

    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentErrors(prev => ({
        ...prev,
        [photoId]: error.message
      }));
    } finally {
      setLoadingComments(prev => ({
        ...prev,
        [photoId]: false
      }));
    }
  };

  // Handle Enter key press in comment input
  const handleKeyPress = (event, photoId) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmitComment(photoId);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading photos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading data: {error}
        </Alert>
        <Button variant="contained" onClick={fetchData}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography variant="h6" color="error">
        User not found.
      </Typography>
    );
  }

  // Format date string
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (err) {
      return 'Invalid date';
    }
  };

  return (
    <div className="user-photos">
      <Typography variant="h4" component="h1">
        Photos of {user.first_name} {user.last_name}
      </Typography>

      {photos.length === 0 ? (
        <Box sx={{ mt: 2, p: 2, textAlign: 'center' }}>
          <Typography variant="body1">
            No photos uploaded yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {user._id === userId ? "Upload your first photo using the 'Add Photo' button!" : "This user hasn't uploaded any photos yet."}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {photos.length} photo{photos.length !== 1 ? 's' : ''} found
          </Typography>
          
          {photos.map((photo) => (
            <Card key={photo._id} className="photo-card" sx={{ mb: 3 }}>
              <CardMedia
                component="img"
                image={`https://sfk4vy-8081.csb.app/images/${photo.file_name}`}
                alt={`Photo by ${user.first_name}`}
                className="photo-image"
                sx={{ 
                  maxHeight: 600,
                  objectFit: 'contain',
                  backgroundColor: '#f5f5f5'
                }}
                onError={(e) => {
                  console.error('Error loading image:', photo.file_name);
                  console.error('Full image URL:', `https://sfk4vy-8081.csb.app/images/${photo.file_name}`);
                  e.target.style.display = 'none';
                  // Show error message
                  const errorDiv = document.createElement('div');
                  errorDiv.innerHTML = `<p style="text-align: center; color: red; padding: 20px;">Failed to load image: ${photo.file_name}</p>`;
                  e.target.parentNode.appendChild(errorDiv);
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', photo.file_name);
                }}
              />

              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Posted on: {formatDate(photo.date_time)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  File: {photo.file_name}
                </Typography>

                <Typography variant="h6" component="h2" className="comments-header" sx={{ mt: 2 }}>
                  Comments ({photo.comments ? photo.comments.length : 0})
                </Typography>

                <List>
                  {/* Existing comments */}
                  {photo.comments && Array.isArray(photo.comments) && photo.comments.length > 0 ? (
                    photo.comments.map((comment, index) => (
                      <ListItem key={comment._id || index} alignItems="flex-start">
                        <ListItemText
                          primary={
                            <React.Fragment>
                              {comment.user ? (
                                <Link to={`/users/${comment.user._id}`}>
                                  {comment.user.first_name} {comment.user.last_name}
                                </Link>
                              ) : (
                                <span>Unknown User</span>
                              )}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                style={{ marginLeft: 10 }}
                              >
                                {formatDate(comment.date_time)}
                              </Typography>
                            </React.Fragment>
                          }
                          secondary={comment.comment}
                        />
                        <Divider />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No comments yet" />
                    </ListItem>
                  )}
                </List>

                {/* Add new comment section */}
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Add a comment:
                  </Typography>
                  
                  {/* Error message */}
                  {commentErrors[photo._id] && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      {commentErrors[photo._id]}
                    </Alert>
                  )}
                  
                  {/* Success message */}
                  {commentSuccess[photo._id] && (
                    <Alert severity="success" sx={{ mb: 1 }}>
                      {commentSuccess[photo._id]}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Write your comment here..."
                    value={newComments[photo._id] || ''}
                    onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, photo._id)}
                    disabled={loadingComments[photo._id]}
                    sx={{ mb: 1 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleSubmitComment(photo._id)}
                      disabled={loadingComments[photo._id] || !newComments[photo._id]?.trim()}
                      startIcon={loadingComments[photo._id] ? <CircularProgress size={16} /> : null}
                    >
                      {loadingComments[photo._id] ? 'Adding...' : 'Add Comment'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </div>
  );
}

export default UserPhotos;