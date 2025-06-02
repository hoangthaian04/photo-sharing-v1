import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import fetchModel, { logoutUser } from "../../lib/fetchModelData";

import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar({ loggedInUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [contextInfo, setContextInfo] = useState("");

  useEffect(() => {
    if (!loggedInUser) {
      setContextInfo("");
      return;
    }

    if (path.startsWith("/users/") && path.split("/").length === 3) {
      const userId = path.split("/")[2];
      fetchModel(`/user/${userId}`)
        .then((user) => {
          if (user) {
            setContextInfo(`${user.last_name}`);
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setContextInfo("");
        });
    } else if (path.startsWith("/photos/") && path.split("/").length === 3) {
      const userId = path.split("/")[2];
      fetchModel(`/user/${userId}`)
        .then((user) => {
          if (user) {
            setContextInfo(`Photos of ${user.last_name}`);
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setContextInfo("");
        });
    } else if (path === "/photo-upload") {
      setContextInfo("Upload New Photo");
    } else {
      setContextInfo("");
    }
  }, [path, loggedInUser]);

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        onLogout();
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        // Still log out on client side even if server request fails
        onLogout();
      });
  };

  const handleAddPhoto = () => {
    navigate("/photo-upload");
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        
        {contextInfo && (
          <Typography variant="h6" color="inherit" sx={{ marginLeft: 2 }}>
            {contextInfo}
          </Typography>
        )}

        <div style={{ flexGrow: 1 }} />

        {loggedInUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button 
              color="inherit" 
              onClick={handleAddPhoto}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Add Photo
            </Button>
            <Typography variant="body1" color="inherit">
              Hi {loggedInUser.last_name}
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              variant="outlined"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Typography variant="body1" color="inherit">
            Please Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;