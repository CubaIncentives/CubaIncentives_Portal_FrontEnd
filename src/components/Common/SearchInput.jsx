import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';
import { ReactComponent as SearchIcon } from '@/assets/images/search-icon.svg';

const SearchInput = ({
  id,
  name,
  label,
  labelClassName,
  inputMarginTop,
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

      <div
        className={classNames(
          'relative',
          inputMarginTop ? inputMarginTop : 'mt-4 sm:mt-1'
        )}
      >
        <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
          <SearchIcon className='w-4 h-4' />
        </div>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='block p-2 leading-7 rounded-lg pl-9 pr-8 w-full appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 placeholder:text-sm focus:border-blueColor focus:outline-none sm:text-sm h-[40px]'
          autoComplete='off'
          disabled={disabled}
        />
        {value !== '' && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
            <div
              className='cursor-pointer flex items-center h-4 w-4 bg-lightRed rounded-full justify-center'
              onClick={() => setSearchTerm('')}
            >
              <XMarkIcon
                className='block h-3 w-3 transform text-darkRed'
                aria-hidden='true'
                title='delete'
              />
            </div>
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
  inputMarginTop: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.any,
  onChange: PropTypes.func,
  setSearchTerm: PropTypes.func,
  value: PropTypes.string,
  disabled: PropTypes.bool,
};
export default SearchInput;
