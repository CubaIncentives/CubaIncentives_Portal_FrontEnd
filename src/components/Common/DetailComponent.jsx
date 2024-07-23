import React from 'react';
import PropTypes from 'prop-types';

const DetailComponent = ({ label, value, noCenter }) => {
  return (
    <div className={`flex ${noCenter ? 'items-start' : 'items-center'} mt-2`}>
      <p className='first-letter:uppercase font-medium text-base min-w-[91px]'>
        {label}
      </p>
      &nbsp;:&nbsp;
      <p className='first-letter:uppercase  text-base text-gray-500 break-words w-3/4'>
        {value}
      </p>
    </div>
  );
};

DetailComponent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noCenter: PropTypes.bool,
  labelIsTop: PropTypes.bool,
};

export default DetailComponent;
