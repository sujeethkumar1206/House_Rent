import api from './api';

export const createBooking = (data) => api.post('/bookings', data);
export const getBookings = () => api.get('/bookings');
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
