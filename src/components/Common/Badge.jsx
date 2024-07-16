import React from 'react';
import PropTypes from 'prop-types';

const sizeClasses = {
  md: 'py-0.5 px-2.5 text-sm',
  lg: 'py-1 px-3 text-sm',
  sm: 'py-0.5 px-2 text-xs',
  default: 'py-0.5 px-2 text-xs',
};

const Badge = ({
  className = 'border-gray-200 bg-gray-50 text-gray-700',
  size = 'lg',
  pillColor,
  children,
}) => {
  const handleSize = sizeClasses[size] || sizeClasses.default;

  return (
    <div
      className={`rounded-lg border flex w-max font-medium items-center ${className} ${handleSize}`}
    >
      {pillColor && (
        <div className={`h-1.5 w-1.5 rounded-full mr-2 ${pillColor}`}></div>
      )}
      <span>{children ? children : 'Badge'}</span>
    </div>
  );
};

Badge.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  pillColor: PropTypes.string,
  children: PropTypes.node,
};

export default Badge;
