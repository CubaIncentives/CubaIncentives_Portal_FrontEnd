import { toast } from 'react-hot-toast';
import axios from 'axios';

import { MESSAGE, RESPONSE_CODE } from '@/utils/constants.js';
import {
  clearLocalStorage,
  errorToast,
  getLocalStorageItem,
} from '@/utils/helper.jsx';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

const setAuthorizationHeader = (config) => {
  const token = getLocalStorageItem('token');

  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return config;
};

api.interceptors.request.use(setAuthorizationHeader, (error) =>
  Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const STATUS = error?.response?.status;
    const DATA = error?.response?.data;

    if (error?.response) {
      if (STATUS === RESPONSE_CODE.UNAUTHORIZED) {
        errorToast(MESSAGE.UNAUTHORIZED, 'erroToasts');
        clearLocalStorage();
        window.location.href = '/sign-in';

        return;
      } else if (STATUS === RESPONSE_CODE.FORBIDDEN) {
        toast.warn('403 Forbidden', {
          toastId: 'customId',
        });
      } else if (STATUS === RESPONSE_CODE.NOT_FOUND) {
        errorToast(DATA?.meta?.message, 'erroToasts');
      } else if (STATUS === RESPONSE_CODE.INTERNAL_SERVER) {
        errorToast(DATA?.message, 'erroToasts');
      } else if (STATUS === RESPONSE_CODE.BAD_REQUEST) {
        errorToast(DATA?.message, 'erroToasts');
      } else if (STATUS === RESPONSE_CODE.UNPROCESSABLE_ENTITY) {
        errorToast(DATA?.message, 'erroToasts');
      } else {
        return Promise.reject(error);
      }
    } else {
      if (!axios.isCancel(error)) {
        errorToast(MESSAGE.ERROR, 'erroToasts');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
