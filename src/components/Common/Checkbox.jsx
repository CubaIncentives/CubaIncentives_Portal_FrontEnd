import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';

const Checkbox = ({ checked = false, onClick, disabled = false, label }) => {
  return (
    <div className=''>
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
        <label htmlFor={label} className='checkbox-container'>
          {label}
          <input
            className={classNames(
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              checked ? 'checked' : ''
            )}
            disabled={disabled}
            type='checkbox'
            id={label}
            checked={checked}
            readOnly
          />
          <span className='checkmark'></span>
        </label>
      </div>
      {/* <div>
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
        </div>
      </div> */}
    </div>
  );
};

Checkbox.propTypes = {
  onClick: PropTypes.func,
  checked: PropTypes.any,
  disabled: PropTypes.bool,
  label: PropTypes.any,
};

export default Checkbox;
