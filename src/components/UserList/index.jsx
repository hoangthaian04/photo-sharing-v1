import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModel("/api/user/list")
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        if (err.message === 'Unauthorized') {
          // User is not logged in, don't show users
          setUsers([]);
        } else {
          setError("Failed to load users");
        }
      });
  }, []);

  if (error) {
    return (
      <div>
        <Typography component="div" variant="body1">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography component="div" variant="body1">
        Users
      </Typography>
      <List component="nav">
        {users.map((user) => (
          <div key={user._id}>
            <ListItem component={Link} to={`/users/${user._id}`}>
              <ListItemText primary={`${user.last_name}`} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}

export default UserList;