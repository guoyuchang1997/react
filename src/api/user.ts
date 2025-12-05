import request from '../utils/request';

export const getUserInfo = (id: any) =>
  request.get('/api/user/list', id).then(res => res.data);

export const addUser = (data: any) =>
  request.post('/api/user/add', data).then(res => res.data);

export const updateUser = (data: any) =>
  request.post('/api/user/update', data).then(res => res.data);

export const deleteUser = (id: string) =>
  request.post('/api/user/delete', { id }).then(res => res.data);