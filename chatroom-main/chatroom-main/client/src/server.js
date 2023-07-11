import axios from 'axios';

export const request = axios.create({
  baseURL: 'http://localhost:4000',
});

export const USER_PATH = '/users';
export const AUTH_PATH = '/auth';
export const CONTACTS_PATH = '/contact';
