import axiosClient from './axiosClient';

export const taskApi = {
  getTasks: (params) => axiosClient.get('/tasks', { params }),
  getTaskStats: () => axiosClient.get('/tasks/stats'),
  getTaskById: (id) => axiosClient.get(`/tasks/${id}`),
  createTask: (data) => axiosClient.post('/tasks', data),
  updateTask: (id, data) => axiosClient.put(`/tasks/${id}`, data),
  updateTaskStatus: (id, status) => axiosClient.patch(`/tasks/${id}/status`, { status }),
  deleteTask: (id) => axiosClient.delete(`/tasks/${id}`)
};

