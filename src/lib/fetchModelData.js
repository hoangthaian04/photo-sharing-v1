/**
 * JWT Token management
 */
const TOKEN_KEY = "photo_app_token";

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url The URL path for the API endpoint.
 * @returns {Promise} A promise that resolves with the model data.
 */
function fetchModel(url) {
  const baseUrl = "https://sfk4vy-8081.csb.app";
  const fullUrl = `${baseUrl}${url}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(fullUrl, {
    headers,
    credentials: "include", // Keep for any other cookies if needed
  })
    .then((response) => {
      if (response.status === 401) {
        // Token expired or invalid, remove it
        removeToken();
        throw new Error("Unauthorized");
      }
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching model:", error);
      throw error;
    });
}

/**
 * Login function - Send login request to server and store JWT token
 *
 * @param {string} login_name The login name of the user
 * @param {string} password The password of the user
 * @returns {Promise} A promise that resolves with the user data
 */
function loginUser(login_name, password) {
  const baseUrl = "https://sfk4vy-8081.csb.app";
  const fullUrl = `${baseUrl}/admin/login`;

  return fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ login_name, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || `Login failed: ${response.status}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      // Store the JWT token
      if (data.token) {
        setToken(data.token);
      }
      return data.user || data; // Return user data
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      throw error;
    });
}

/**
 * Logout function - Send logout request to server and remove JWT token
 *
 * @returns {Promise} A promise that resolves when logout is successful
 */
function logoutUser() {
  const baseUrl = "https://sfk4vy-8081.csb.app";
  const fullUrl = `${baseUrl}/admin/logout`;
  const token = getToken();

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(fullUrl, {
    method: "POST",
    headers,
    credentials: "include",
  })
    .then((response) => {
      // Always remove token from localStorage, regardless of server response
      removeToken();

      if (!response.ok) {
        console.warn(`Logout request failed: ${response.status}`);
        // Don't throw error since we've already removed the token locally
      }
      return true;
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      // Still remove token even if network request fails
      removeToken();
      return true;
    });
}

/**
 * Check if user is authenticated by verifying token
 *
 * @returns {boolean} True if user has a valid token
 */
function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  try {
    // Basic JWT token validation (check if it's expired)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp && payload.exp < currentTime) {
      // Token is expired, remove it
      removeToken();
      return false;
    }

    return true;
  } catch (error) {
    // Invalid token format, remove it
    removeToken();
    return false;
  }
}

/**
 * Get current user info from token
 *
 * @returns {object|null} User info from token or null if no valid token
 */
function getCurrentUserFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp && payload.exp < currentTime) {
      removeToken();
      return null;
    }

    return {
      _id: payload.user_id,
      login_name: payload.login_name,
      first_name: payload.first_name,
    };
  } catch (error) {
    removeToken();
    return null;
  }
}

export default fetchModel;
export {
  loginUser,
  logoutUser,
  isAuthenticated,
  getCurrentUserFromToken,
  getToken,
  setToken,
  removeToken,
};
