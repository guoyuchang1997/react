import request from '../utils/request';

export const getUserInfo = (params: { keyword?: string }) =>
  request.get('/api/user/list', { params }).then(res => res.data);

export const addUser = (data: any) =>
  request.post('/api/user/add', data).then(res => res.data);

export const updateUser = (data: any) =>
  request.post('/api/user/update', data).then(res => res.data);

export const deleteUser = (id: string) =>
  request.post('/api/user/delete', { id }).then(res => res.data);