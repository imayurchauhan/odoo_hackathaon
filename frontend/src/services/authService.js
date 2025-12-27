import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  if (res.data.token) localStorage.setItem('token', res.data.token);
  if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
  // Notify app about auth change
  try { window.dispatchEvent(new Event('authChanged')); } catch (e){}
  return res.data;
};

export const register = async (name, email, password, team) => {
  const res = await api.post('/auth/register', { name, email, password, team });
  if (res.data.token) localStorage.setItem('token', res.data.token);
  if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
  try { window.dispatchEvent(new Event('authChanged')); } catch (e){}
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  try { window.dispatchEvent(new Event('authChanged')); } catch (e){}
};
