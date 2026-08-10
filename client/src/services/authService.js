import api from './api';

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const logoutUser = () => api.post('/auth/logout');
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (formData) =>
  api.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const changePassword = (data) => api.put('/auth/change-password', data);
