import "./App.css";

import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import PhotoUpload from "./components/PhotoUpload";
import fetchModel, {
  isAuthenticated,
  getCurrentUserFromToken,
} from "./lib/fetchModelData";

const App = (props) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if we have a valid token
        if (isAuthenticated()) {
          // Get user info from token
          const userFromToken = getCurrentUserFromToken();

          if (userFromToken) {
            // Verify token is still valid by making an API call
            try {
              await fetchModel("/user/list");
              // If successful, we need to get full user info
              const fullUserInfo = await fetchModel(
                `/user/${userFromToken._id}`
              );
              setLoggedInUser(fullUserInfo);
            } catch (error) {
              if (error.message === "Unauthorized") {
                setLoggedInUser(null);
              } else {
                // If we can't fetch full info, use token info
                setLoggedInUser(userFromToken);
              }
            }
          }
        } else {
          setLoggedInUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setLoggedInUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </div>
    );
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
            <TopBar loggedInUser={loggedInUser} onLogout={handleLogout} />
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
                  element={
                    loggedInUser ? (
                      <Navigate to={`/users/${loggedInUser._id}`} replace />
                    ) : (
                      <LoginRegister onLogin={handleLogin} />
                    )
                  }
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
