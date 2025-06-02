/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url The URL path for the API endpoint.
 * @returns {Promise} A promise that resolves with the model data.
 */
function fetchModel(url) {
  const baseUrl = "https://lnmx2d-8081.csb.app/api";
  const fullUrl = `${baseUrl}${url}`;

  return fetch(fullUrl, {
    credentials: 'include', // Include cookies for session management
  })
    .then((response) => {
      if (response.status === 401) {
        // User is not logged in, redirect to login
        throw new Error('Unauthorized');
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
 * Login function - Send login request to server
 *
 * @param {string} login_name The login name of the user
 * @returns {Promise} A promise that resolves with the user data
 */
function loginUser(login_name) {
  const baseUrl = "https://lnmx2d-8081.csb.app/api";
  const fullUrl = `${baseUrl}/admin/login`;

  return fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ login_name }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      throw error;
    });
}

/**
 * Logout function - Send logout request to server
 *
 * @returns {Promise} A promise that resolves when logout is successful
 */
function logoutUser() {
  const baseUrl = "https://lnmx2d-8081.csb.app/api";
  const fullUrl = `${baseUrl}/admin/logout`;

  return fetch(fullUrl, {
    method: 'POST',
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.status}`);
      }
      return response.ok;
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      throw error;
    });
}

export default fetchModel;
export { loginUser, logoutUser };