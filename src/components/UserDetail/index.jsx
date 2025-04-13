import React from "react";
import { 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Divider
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const user = models.userModel(userId);

  return (
    <div className="user-detail-container">
      <Card sx={{ maxWidth: 800, margin: '0 auto', marginTop: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {user.first_name} {user.last_name}
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          
          <Typography variant="body1" gutterBottom>
            <strong>Location:</strong> {user.location}
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            <strong>Occupation:</strong> {user.occupation}
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Description:</strong> {user.description}
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to={`/photos/${user._id}`}
          >
            View Photos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserDetail;