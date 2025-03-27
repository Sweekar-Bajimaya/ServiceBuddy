import axios from 'axios';

// Base URL for your Django backend
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Attach token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth endpoints
export const registerUser = (data) => API.post('/register/', data);
export const loginUser = (data) => API.post('/login/', data);
export const refreshAccessToken = (data) => API.post('/token/refresh/', data); // If implemented

// Providers endpoints
export const getProviders = (params) => API.get('/service-providers/', { params });

// **Admin Providers Endpoint**
export const getAdminProviders = async () => {
  try {
    return await axios.get('/api/admin/providers/', {
      headers: {
        Authorization: `JWT ${localStorage.getItem('access_token')}`
      }
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Service requests endpoints
export const createServiceRequest = (data) => API.post('/service-requests/', data);
export const updateServiceRequest = (requestId, data) => API.patch(`/service-requests/${requestId}/`, data);

// Bill endpoints
export const generateBill = (data) => API.post('/bills/', data);

// My Bookings endpoint (if implemented)
export const getMyBookings = () => API.get('/my-bookings/');

// Notifications endpoint (example)
export const getNotifications = () => API.get('/notifications/');

export const forgotPassword = (data) => API.post('/password-reset/', data);

export const resetPassword = (data) => API.post('/password-reset-confirm/', data);

export const getProviderRequests = () => API.get('/provider-requests/');

export const addServiceProvider = async (providerData) => {
  const response = await API.post('/add-provider/', providerData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
