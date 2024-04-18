import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';
import { ReactComponent as Spinner } from '@/assets/images/spinner.svg';

const CustomSpinner = ({ className }) => {
  return (
    <div role='status'>
      <Spinner
        className={classNames(
          'w-8 h-8 mx-auto text-gray-200 animate-spin fill-blue-600',
          className ? className : ''
        )}
      />
      <span className='sr-only'> Loading... </span>
    </div>
  );
};

export default CustomSpinner;

CustomSpinner.propTypes = {
  className: PropTypes.string,
};
