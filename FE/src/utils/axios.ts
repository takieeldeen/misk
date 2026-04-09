import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';
 
 import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });
// const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  // const token = localStorage.getItem('accessToken');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  console.log(config);
  return config;
});

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
<<<<<<< HEAD
    me: 'https://api-dev-minimal-v610.pages.dev/api/auth/me',
    signIn: 'https://api-dev-minimal-v610.pages.dev/api/auth/sign-in',
    signUp: 'https://api-dev-minimal-v610.pages.dev/api/auth/sign-up',
=======
    me: '/api/auth/me',
    signIn: '/auth/login',
    signUp: '/api/auth/sign-up',
>>>>>>> 2f820c9bb4895ab14c40fc1c40f997b586e562bc
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
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  brand: {
    list: '/brands',
    details: '/brand/details',
    search: '/brand/search',
  },
};
