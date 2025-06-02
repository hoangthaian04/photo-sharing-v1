import "./App.css";

import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import PhotoUpload from "./components/PhotoUpload";
import fetchModel from "./lib/fetchModelData";

const App = (props) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    // Try to fetch user list to check if we're logged in
    fetchModel("/user/list")
      .then(() => {
        // If successful, we need to get current user info
        // For now, we'll store it in TopBar component
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.message === 'Unauthorized') {
          setLoggedInUser(null);
        }
        setIsLoading(false);
      });
  }, []);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!loggedInUser) {
      return <LoginRegister onLogin={handleLogin} />;
    }
    return children;
  };

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar 
              loggedInUser={loggedInUser} 
              onLogout={handleLogout}
            />
          </Grid>
          {loggedInUser && (
            <Grid item sm={3} md={2}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
          )}
          <Grid item sm={loggedInUser ? 9 : 12} md={loggedInUser ? 10 : 12}>
            <Paper className="main-grid-item">
              <Routes>
                <Route 
                  path="/login-register" 
                  element={<LoginRegister onLogin={handleLogin} />} 
                />
                <Route 
                  path="/" 
                  element={
                    loggedInUser ? (
                      <Navigate to={`/users/${loggedInUser._id}`} replace />
                    ) : (
                      <LoginRegister onLogin={handleLogin} />
                    )
                  } 
                />
                <Route 
                  path="/users/:userId" 
                  element={
                    <ProtectedRoute>
                      <UserDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/photos/:userId" 
                  element={
                    <ProtectedRoute>
                      <UserPhotos />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/photo-upload" 
                  element={
                    <ProtectedRoute>
                      <PhotoUpload loggedInUser={loggedInUser} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="*" 
                  element={
                    loggedInUser ? (
                      <Navigate to={`/users/${loggedInUser._id}`} replace />
                    ) : (
                      <LoginRegister onLogin={handleLogin} />
                    )
                  } 
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;