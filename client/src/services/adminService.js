import api from './api';

export const getDashboard = () => api.get('/admin/dashboard');
export const getUsers = (search) => api.get('/admin/users', { params: { search } });
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAllProperties = (status, search) => api.get('/admin/properties', { params: { status, search } });
export const approveProperty = (id) => api.put(`/admin/properties/${id}/approve`);
export const rejectProperty = (id) => api.put(`/admin/properties/${id}/reject`);
export const deleteAnyProperty = (id) => api.delete(`/admin/properties/${id}`);
export const getAllBookings = () => api.get('/admin/bookings');
