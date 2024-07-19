import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';

const Button = ({
  type = 'submit',
  loading,
  className = '',
  onClick,
  disabled = false,
  size = 'md',
  children,
  isOutlined,
  ...rest
}) => {
  const handleClassName = () => {
    const sizeClass = {
      sm: 'py-1.5 px-3 text-xs',
      md: 'py-2 px-3 text-sm',
      lg: 'py-2.5 px-[18px] text-base',
      xl: 'py-3 px-5 text-base',
      xxl: 'py-4 px-7 text-lg',
    };

    return sizeClass[size] || 'py-2 px-3.5 text-sm';
  };

  return (
    <button
      {...rest}
      type={type}
      className={classNames(
        'outline-none font-semibold rounded-md hover:opacity-90 disabled:bg-palette5 disabled:cursor-not-allowed border',
        handleClassName(),
        isOutlined
          ? 'text-white bg-customBlack'
          : 'border-blueColor bg-gradient-to-r from-blueColor to-[#2958AE] text-white',
        className
      )}
      onClick={(e) => {
        !disabled && onClick && onClick(e);
      }}
      disabled={disabled || loading}
    >
      <div className='flex items-center justify-center gap-2'>
        {loading && (
          <svg
            className='animate-spin -ml-1 mr-3 h-5 w-5 text-black'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              stroke='black'
              strokeWidth='4'
              cx='12'
              cy='12'
              r='10'
            ></circle>
            <path
              className='opacity-75'
              fill='white'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        )}
        {children}
      </div>
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  isOutlined: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'xxl']),
  children: PropTypes.any,
  loading: PropTypes.bool,
};

export default Button;
