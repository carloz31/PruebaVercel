import axiosInstance from '../utils/axiosConfig';

const get = (url) => {
  return axiosInstance.get(url);
};

const getPrivate = (url) => {
  return axiosInstance.get(url);
};

const getToken = async (code) => {
  try {
    debugger
    const response = await axiosInstance.get(`/api/auth/callback?code=${code}`, { observe: 'response' });
    console.log(response);
    if (response.status === 200 && response.data) {
      localStorage.setItem('jwtToken', response.data.token); // Save token to local storage
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error fetching token:', error);
    return false;
  }
};

export { get, getPrivate, getToken };
