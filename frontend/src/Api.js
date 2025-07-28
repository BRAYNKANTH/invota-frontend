import axios from 'axios';

// Create an axios instance for making HTTP requests to the backend
const api = axios.create({
  baseURL: 'https://invota-backend-hub0bnajdjgje3dr.southindia-01.azurewebsites.net/api',  // Set your backend URL here
  timeout: 10000,  // Optional: timeout if the request takes too long
});

// Function to handle login request
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;  // This is the JWT token
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// Function to handle update account request
export const updateAccount = async (userId, email, username, password) => {
  try {
    const response = await api.put('/update-account', { email, username, password }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// Additional functions can be added for other API calls (e.g., get sensitive details, etc.)

export default api;
