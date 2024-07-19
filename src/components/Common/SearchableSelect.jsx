import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { classNames, handleDropdownStyle } from '@/utils/helper';

const SearchableSelect = ({
  label,
  labelClassName = '',
  inputMarginTop = '',
  options,
  loading,
  onChange,
  selected,
  disabled = false,
  placeholder = 'Select',
  isMulti = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const styles = handleDropdownStyle();

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <span className='pointer-events-none'>
          <ChevronDownIcon
            className='h-5 w-5 text-customBlack'
            aria-hidden='true'
          />
        </span>
      </components.DropdownIndicator>
    );
  };

  const CustomClearText = () => (
    <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
      <div className='flex items-center h-4 w-4 bg-lightRed rounded-full justify-center'>
        <XMarkIcon
          className='block h-3 w-3 transform text-darkRed cursor-pointer '
          aria-hidden='true'
          title='delete'
        />
      </div>
    </div>
  );

  const ClearIndicator = (props) => {
    const {
      children = <CustomClearText />,
      getStyles,
      innerProps: { ref, ...restInnerProps },
    } = props;

    return (
      <div
        {...restInnerProps}
        ref={ref}
        style={getStyles('clearIndicator', props)}
      >
        <div style={{ padding: '0px 5px' }}>{children}</div>
      </div>
    );
  };

  ClearIndicator.propTypes = {
    children: PropTypes.any,
    getStyles: PropTypes.any,
    innerProps: PropTypes.any,
  };

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return (
    <div>
      {label && (
        <div className={`${!inputMarginTop ? 'mb-1.5' : ''}`}>
          <label className={classNames('label', labelClassName)}>
            {label}&nbsp;
          </label>
        </div>
      )}
      <div className={classNames(inputMarginTop ? inputMarginTop : '')}>
        <Select
          isMulti={isMulti}
          isClearable={true}
          components={{ DropdownIndicator, ClearIndicator }}
          isDisabled={isLoading || disabled}
          options={options}
          onChange={(newValue) => {
            onChange(newValue);
          }}
          placeholder={placeholder}
          styles={styles}
          value={selected}
        />
      </div>
    </div>
  );
};

SearchableSelect.propTypes = {
  label: PropTypes.any,
  labelClassName: PropTypes.string,
  inputMarginTop: PropTypes.string,
  options: PropTypes.array,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  isMulti: PropTypes.bool,
  selected: PropTypes.any,
};

export default SearchableSelect;
