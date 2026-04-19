import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const baseURL = typeof window === 'undefined' 
  ? 'http://localhost:8080/api/v1'
  : CONFIG.serverUrl;

const axiosInstance = axios.create({ baseURL });
// const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => config);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error, error.response);
    return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/auth/me',
    // signIn: 'https://api-dev-minimal-v610.pages.dev/api/auth/sign-in',
    signIn: '/auth/login',
    signOut: '/auth/logout',
    signUp: 'https://api-dev-minimal-v610.pages.dev/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/products',
    details: (id: string) => `/products/${id}`,
    search: '/products/search',
    activate: (id: string) => `/products/${id}/activate`,
    deactivate: (id: string) => `/products/${id}/deactivate`,
    reviews: (id: string) => `/products/${id}/reviews`,
    ratings: (id: string) => `/products/${id}/ratings`,
    reviewDetails: (productId: string, reviewId: string) => `/products/${productId}/reviews/${reviewId}`,
  },
  brand: {
    list: '/brands',
    details: (id: string) => `/brands/${id}`,
    search: '/brand/search',
    deleteMany: '/brands/delete-many',
    activate: (id: string) => `/brands/${id}/activate`,
    deactivate: (id: string) => `/brands/${id}/deactivate`,
  },
  category: {
    list: '/categories',
    details: (id: string) => `/categories/${id}`,
    search: '/category/search',
    deleteMany: '/categories/delete-many',
    activate: (id: string) => `/categories/${id}/activate`,
    deactivate: (id: string) => `/categories/${id}/deactivate`,
  },
};
