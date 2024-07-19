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

export const transformSearchableSelectOptions = (options, key = null) => {
  return options?.map((item) => ({
    value: item?.id,
    label: key ? item[key] : item?.name,
    ...item,
  }));
};

export const customSearchableSelectOptions = (options) => {
  return options?.map((item) => ({
    value: item,
    label: item,
  }));
};

export const handleDropdownStyle = (error) => {
  return {
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, backgroundColor: '' } : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? { ...base, color: '#9ca3af', fontSize: 14, paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: 'none' } : base;
    },
    control: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? '#98A2B3' : '#000',
      backgroundColor: state.isDisabled ? '#F9FAFB' : '',
      borderRadius: '8px',
      border: error
        ? '1px solid #FDA29B'
        : state.isFocused
          ? '1px solid #00A3FF'
          : '1px solid #D0D5DD',
      '&:hover': {
        border: error
          ? '1px solid #FDA29B'
          : state.isFocused
            ? '1px solid #00A3FF'
            : '1px solid #D0D5DD',
      },

      boxShadow: 'none',
      fontWeight: '400',
      fontSize: '14px',
      minHeight: '40px',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    }),
    // eslint-disable-next-line
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        cursor: 'pointer',
        color: isDisabled
          ? '#ccc'
          : isSelected
            ? 'white'
            : isFocused
              ? 'white'
              : 'black',
        backgroundColor: isDisabled
          ? undefined
          : isSelected
            ? '#99daff'
            : isFocused
              ? '#00A3FF'
              : undefined,

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? '#99daff'
              : '#00A3FF'
            : undefined,
        },
      };
    },

    placeholder: (provided) => ({
      ...provided,
      color: '#98A2B3',
    }),

    indicatorsContainer: (provided) => ({
      ...provided,
      padding: 0,
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
  };
};

export const sortedTimes = (times) => {
  return times.sort((a, b) => {
    const [hoursA, minutesA] = a.split(':').map(Number);
    const [hoursB, minutesB] = b.split(':').map(Number);

    if (hoursA === hoursB) {
      return minutesA - minutesB;
    }

    return hoursA - hoursB;
  });
};

export const sortByLocation = (data) => {
  return data.sort((a, b) => {
    if (!a.location) return 1;
    if (!b.location) return -1;

    return a.location.localeCompare(b.location);
  });
};
