import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
  baseURL: process.env.backend,
  withCredentials: true
});

// Add a request interceptor to attach the JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // Get the token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;

