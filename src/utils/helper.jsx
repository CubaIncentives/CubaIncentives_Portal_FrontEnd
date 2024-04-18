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
  localStorage.clear();
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

/* Capitalize first string Function */
export const capitalize = (str) => {
  if (typeof str !== 'string') return str;

  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};

/* For common input style */
export const handleInputStyle = (error, disabled, className, icon) => {
  return `rounded-lg py-2 outline-none placeholder-gray-500 px-3 pe-8 border ${
    icon ? 'ps-9' : ''
  } ${
    error
      ? 'border-error-300 focus:border-error-300 focus:shadow-outline-error'
      : 'border-gray-300 focus:border-indigo-300 focus:shadow-outline-purple'
  } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'} ${className}`;
};

/* get initials of name */
export const getInitials = (name) => {
  const words = name.split(' ');

  const initials = `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`;

  return initials;
};
