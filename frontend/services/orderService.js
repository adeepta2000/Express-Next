import API from './api';

export const fetchOrders = () => API.get('/orders');
export const fetchOrderById = (id) => API.get(`/orders/${id}`);
export const createOrder = (order) => API.post('/orders', order);
export const updateOrder = (id, order) => API.put(`/orders/${id}`, order);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);