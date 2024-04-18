import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { capitalize, classNames, handleInputStyle } from '@/utils/helper';

const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  error,
  disabled,
  min,
  max,
  pattern,
  maxLength,
  label,
  isRequired,
  showPassword,
  setShowPassword,
  showIcon,
  labelClassName,
  isFirstCapital = false,
  ...restProps
}) => {
  return (
    <div>
      <div>
        {label && (
          <label className={classNames('label', labelClassName)}>
            {label}&nbsp;
          </label>
        )}
        {isRequired && <span className='text-error-500 pe-1'>&#42;</span>}
      </div>

      <div className='rounded-lg mt-1.5 relative'>
        <input
          type={type}
          className={classNames(
            handleInputStyle(error, disabled, className),
            'w-full h-[40px] text-sm'
          )}
          placeholder={placeholder}
          value={isFirstCapital ? capitalize(value) : value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          max={max}
          pattern={pattern}
          maxLength={maxLength}
          {...restProps}
        />
        {showIcon && (
          <div>
            {showPassword ? (
              <EyeSlashIcon
                onClick={() => setShowPassword(!showPassword)}
                className='h-6 w-6 cursor-pointer absolute top-[8px] right-3 text-xl text-gray-400'
              />
            ) : (
              <EyeIcon
                onClick={() => setShowPassword(!showPassword)}
                className='h-6 w-6 cursor-pointer absolute top-[8px] right-3 text-xl text-gray-400'
              />
            )}
          </div>
        )}
      </div>

      {error && (
        <div className='text-error-500 text-sm font-normal mt-1.5'>{error}</div>
      )}
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.any,
  disabled: PropTypes.bool,
  min: PropTypes.any,
  max: PropTypes.any,
  pattern: PropTypes.string,
  maxLength: PropTypes.any,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isRequired: PropTypes.bool,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func,
  showIcon: PropTypes.bool,
  labelClassName: PropTypes.string,
  isFirstCapital: PropTypes.bool,
};

export default Input;
