import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token  = localStorage.getItem("token")
    const tokenExpirationTime = localStorage.getItem("tokenExpirationTime")
    if(token && tokenExpirationTime && Date.now() > parseInt(tokenExpirationTime)){
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpirationTime");
      window.location.reload();
    }
    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptors (Optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;