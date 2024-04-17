import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

import { MESSAGE } from './constants';

export const classNames = (...classes) =>
  twMerge(classes.filter(Boolean).join(' '));

export const getLocalStorageItem = (key) => {
  return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
};

export const setLocalStorageItem = (key, value) => {
  const parsedValue = typeof value !== 'string' ? JSON.stringify(value) : value;

  return typeof window !== 'undefined'
    ? localStorage.setItem(key, parsedValue)
    : null;
};

export const removeLocalStorageItem = (key) => {
  return typeof window !== 'undefined' ? localStorage.removeItem(key) : null;
};

/* Clear Local Storage Function */

export const clearLocalStorage = () => {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);

    if (key !== 'credentials') {
      localStorage.removeItem(key);
    }
  }
};

/* Token Validation Function */
export const checkTokenValid = () => {
  let token = getLocalStorageItem('token');

  return token || false;
};

/* Error Toast Message*/

export const errorToast = (msg = MESSAGE.ERROR, toastId = '') =>
  toast.error(msg, {
    autoClose: 2000,
    id: toastId,
  });

/* Success Toast Message*/

export const successToast = (msg = MESSAGE.SUCCESS, toastId = '') =>
  toast.success(msg, {
    autoClose: 2000,
    id: toastId,
  });
