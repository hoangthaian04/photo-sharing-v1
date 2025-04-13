import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import models from "../../modelData/models";

import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const path = location.pathname;
  let contextInfo = "";
  if (path.startsWith("/users/") && path.split("/").length === 3) {
    const userId = path.split("/")[2];
    const user = models.userModel(userId);
    if (user) {
      contextInfo = `${user.first_name} ${user.last_name}`;
    }
  } else if (path.startsWith("/photos/") && path.split("/").length === 3) {
    const userId = path.split("/")[2];
    const user = models.userModel(userId);
    if (user) {
      contextInfo = `Photos of ${user.first_name} ${user.last_name}`;
    }
  }

  return (
    <AppBar className="topbar-appBar" position="static">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Hoàng Thái An
        </Typography>
        {contextInfo && (
          <Typography variant="h6" color="inherit">
            {contextInfo}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;