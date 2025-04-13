import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const users = models.userListModel();
  
  return (
    <div>
      <Typography variant="h5" sx={{ padding: "16px 0" }}>
        Users
      </Typography>
      <Divider />
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem 
              button 
              component={Link} 
              to={`/users/${user._id}`}
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemText 
                primary={`${user.first_name} ${user.last_name}`} 
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;