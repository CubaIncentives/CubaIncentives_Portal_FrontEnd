import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';

const SearchInput = ({
  id,
  name,
  label,
  labelClassName,
  type,
  onChange,
  placeholder,
  value,
  setSearchTerm,
  disabled,
}) => {
  return (
    <div>
      <div>
        {label && (
          <label className={classNames('label', labelClassName)}>
            {label}&nbsp;
          </label>
        )}
      </div>

      <div className='relative mt-4 sm:mt-1'>
        <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
          <svg
            className='w-4 h-4 text-gray-500'
            aria-hidden='true'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
              clipRule='evenodd'
            ></path>
          </svg>
        </div>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='block p-2 leading-7 rounded-lg pl-8 pr-8 w-full appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 placeholder:text-sm focus:border-palette4 focus:outline-none sm:text-sm h-[40px]'
          autoComplete='off'
          disabled={disabled}
        />
        {value !== '' && (
          <div className='flex absolute inset-y-0 right-0 items-center pr-3'>
            <XMarkIcon
              className='cursor-pointer block h-4 w-4 transform rounded-full bg-error-500 ring-2 ring-white text-white'
              aria-hidden='true'
              title='delete'
              onClick={() => setSearchTerm('')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.any,
  onChange: PropTypes.func,
  setSearchTerm: PropTypes.func,
  value: PropTypes.string,
  disabled: PropTypes.bool,
};
export default SearchInput;
