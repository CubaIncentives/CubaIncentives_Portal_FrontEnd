import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

import { handleDropdownStyle } from '@/utils/helper';

const SearchableSelect = ({
  label,
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
            className='h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </span>
      </components.DropdownIndicator>
    );
  };

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  return (
    <div>
      {label && (
        <div className='mb-1.5'>
          <label className='label'>{label}&nbsp;</label>
        </div>
      )}
      <div>
        <Select
          isMulti={isMulti}
          isClearable={true}
          components={{ DropdownIndicator }}
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
  options: PropTypes.array,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  isMulti: PropTypes.bool,
  selected: PropTypes.any,
};

export default SearchableSelect;
