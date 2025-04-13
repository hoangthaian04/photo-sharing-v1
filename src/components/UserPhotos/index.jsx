import React from "react";
import { 
  Typography, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams();
  const user = models.userModel(userId);
  const photos = models.photoOfUserModel(userId);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getImagePath = (fileName) => {
    return require(`../../images/${fileName}`);
  };

  return (
    <div className="user-photos-container">
      <Typography variant="h4" component="h1" sx={{ marginBottom: 3 }}>
        Photos of {user.first_name} {user.last_name}
      </Typography>
      
      {photos.map(photo => (
        <Card key={photo._id} sx={{ marginBottom: 4 }}>
          <img 
            src={getImagePath(photo.file_name)} 
            alt={`Photo by ${user.first_name}`}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
          
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Posted on: {formatDate(photo.date_time)}
            </Typography>
            
            <Typography variant="h6" component="h3" sx={{ marginTop: 2, marginBottom: 1 }}>
              Comments
            </Typography>
            
            <List>
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map(comment => (
                  <React.Fragment key={comment._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <>
                            <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none' }}>
                              {comment.user.first_name} {comment.user.last_name}
                            </Link>
                            {" - "}
                            <Typography component="span" variant="body2" color="text.secondary">
                              {formatDate(comment.date_time)}
                            </Typography>
                          </>
                        }
                        secondary={comment.comment}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No comments yet" />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;