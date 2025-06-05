import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Box,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import { loginUser } from "../../lib/fetchModelData";
import "./styles.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function LoginRegister({ onLogin }) {
  const [tabValue, setTabValue] = useState(0);

  // Login states
  const [loginData, setLoginData] = useState({
    login_name: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration states
  const [registerData, setRegisterData] = useState({
    login_name: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Clear errors when switching tabs
    setLoginError("");
    setRegisterError("");
    setRegisterSuccess("");
  };

  // Handle Login with JWT
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.login_name.trim() || !loginData.password) {
      setLoginError("Please enter both login name and password");
      return;
    }

    setLoginLoading(true);
    setLoginError("");

    try {
      // Use the updated loginUser function that handles JWT
      const userData = await loginUser(
        loginData.login_name.trim(),
        loginData.password
      );

      // The loginUser function now handles token storage automatically
      onLogin(userData);
    } catch (err) {
      console.error("Login error:", err);
      setLoginError(err.message || "Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!registerData.login_name.trim()) {
      setRegisterError("Login name is required");
      return;
    }

    if (!registerData.password) {
      setRegisterError("Password is required");
      return;
    }

    if (!registerData.first_name.trim()) {
      setRegisterError("First name is required");
      return;
    }

    if (!registerData.last_name.trim()) {
      setRegisterError("Last name is required");
      return;
    }

    // Validate password match
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    setRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const response = await fetch("https://sfk4vy-8081.csb.app/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          login_name: registerData.login_name.trim(),
          password: registerData.password,
          first_name: registerData.first_name.trim(),
          last_name: registerData.last_name.trim(),
          location: registerData.location.trim(),
          description: registerData.description.trim(),
          occupation: registerData.occupation.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterSuccess("Registration successful! You can now log in.");
        // Clear form
        setRegisterData({
          login_name: "",
          password: "",
          confirmPassword: "",
          first_name: "",
          last_name: "",
          location: "",
          description: "",
          occupation: "",
        });
        // Switch to login tab after 2 seconds
        setTimeout(() => {
          setTabValue(0);
          setRegisterSuccess("");
        }, 2000);
      } else {
        setRegisterError(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegisterError("Network error. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLoginInputChange = (field, value) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (loginError) setLoginError("");
  };

  const handleRegisterInputChange = (field, value) => {
    setRegisterData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (registerError) setRegisterError("");
  };

  return (
    <div className="login-register-container">
      <Paper className="login-form" elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Photo Sharing App
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="login register tabs"
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </Box>

        {/* Login Tab */}
        <TabPanel value={tabValue} index={0}>
          {loginError && (
            <Alert severity="error" style={{ marginBottom: "1rem" }}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Login Name"
              value={loginData.login_name}
              onChange={(e) =>
                handleLoginInputChange("login_name", e.target.value)
              }
              margin="normal"
              variant="outlined"
              disabled={loginLoading}
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                handleLoginInputChange("password", e.target.value)
              }
              margin="normal"
              variant="outlined"
              disabled={loginLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={
                loginLoading ||
                !loginData.login_name.trim() ||
                !loginData.password
              }
              style={{ marginTop: "1rem" }}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </TabPanel>

        {/* Register Tab */}
        <TabPanel value={tabValue} index={1}>
          {registerError && (
            <Alert severity="error" style={{ marginBottom: "1rem" }}>
              {registerError}
            </Alert>
          )}

          {registerSuccess && (
            <Alert severity="success" style={{ marginBottom: "1rem" }}>
              {registerSuccess}
            </Alert>
          )}

          <form onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Login Name *"
                  value={registerData.login_name}
                  onChange={(e) =>
                    handleRegisterInputChange("login_name", e.target.value)
                  }
                  variant="outlined"
                  disabled={registerLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name *"
                  value={registerData.first_name}
                  onChange={(e) =>
                    handleRegisterInputChange("first_name", e.target.value)
                  }
                  variant="outlined"
                  disabled={registerLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  value={registerData.last_name}
                  onChange={(e) =>
                    handleRegisterInputChange("last_name", e.target.value)
                  }
                  variant="outlined"
                  disabled={registerLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password *"
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    handleRegisterInputChange("password", e.target.value)
                  }
                  variant="outlined"
                  disabled={registerLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password *"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    handleRegisterInputChange("confirmPassword", e.target.value)
                  }
                  variant="outlined"
                  disabled={registerLoading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={registerData.location}
                  onChange={(e) =>
                    handleRegisterInputChange("location", e.target.value)
                  }
                  variant="outlined"
                  disabled={registerLoading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={registerData.occupation}
                  onChange={(e) =>
                    handleRegisterInputChange("occupation", e.target.value)
                  }
                  variant="outlined"
                  disabled={registerLoading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={registerData.description}
                  onChange={(e) =>
                    handleRegisterInputChange("description", e.target.value)
                  }
                  variant="outlined"
                  disabled={registerLoading}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={registerLoading}
                  style={{ marginTop: "1rem" }}
                >
                  {registerLoading ? "Registering..." : "Register Me"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
      </Paper>
    </div>
  );
}

export default LoginRegister;
