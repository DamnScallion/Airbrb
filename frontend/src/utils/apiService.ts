/* eslint-disable @typescript-eslint/no-explicit-any */
import config from 'config.json';
import { storeToken, storeEmail, clearLocalStorage } from './helper'

const BACKEND_PORT = config.BACKEND_PORT;

export const apiCall = async (url: string, method: string, body?: any) => {
  try {
    const response = await fetch(`http://localhost:${BACKEND_PORT}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') && { Authorization: `Bearer ${localStorage.getItem('token')}` }),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (response.ok) {
      return { data };
    } else {
      throw new Error(data.error);
    }
  } catch (error: any) {
    return { error: error.message };
  }
};

export const login = async (email: string, password: string) => {
  const { data, error } = await apiCall('/user/auth/login', 'POST', { email, password });
  if (data && !error) {
    storeToken(data.token);
    storeEmail(email);
    return true;
  } else {
    throw new Error(error);
  }
};

export const logout = async () => {
  const { error } = await apiCall('/user/auth/logout', 'POST');
  if (!error) {
    clearLocalStorage();
    return true;
  } else {
    throw new Error(error);
  }
};

export const register = async (email: string, password: string, name: string) => {
  const { data, error } = await apiCall('/user/auth/register', 'POST', { email, password, name });
  if (data && !error) {
    storeToken(data.token);
    storeEmail(email);
    return true;
  } else {
    throw new Error(error);
  }
};
