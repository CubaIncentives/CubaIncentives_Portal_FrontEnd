import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';

const Checkbox = ({
  checked = false,
  onClick,
  disabled = false,
  label,
  note,
}) => {
  return (
    <div className='flex items-center'>
      <div
        className={classNames(
          disabled ? 'switch-disabled' : 'switch',
          disabled
            ? checked
              ? 'cursor-not-allowed'
              : 'cursor-not-allowed'
            : 'cursor-pointer'
        )}
        onClick={!disabled ? onClick : null}
      >
        <input
          className={classNames(
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
          disabled={disabled}
          type='checkbox'
          id={label}
          checked={checked}
          readOnly
        />
        <label htmlFor={label} className='ml-2' />
      </div>
      <div>
        <div className='text-sm'>
          <label
            onClick={!disabled ? onClick : null}
            className={classNames(
              'text-gray-700 font-medium first-letter:uppercase',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            {label}
          </label>
          <p className='text-gray-600 font-normal'>{note}</p>
        </div>
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  onClick: PropTypes.func,
  checked: PropTypes.any,
  disabled: PropTypes.bool,
  label: PropTypes.any,
  note: PropTypes.string,
};

export default Checkbox;
