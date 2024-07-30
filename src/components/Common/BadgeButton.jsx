import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';

const BadgeButton = ({ children, onClick, isSelected, className }) => {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2 py-1 font-medium gap-2 text-sm shadow-2xl cursor-pointer select-none ',
        isSelected
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-700 hover:text-white',
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

BadgeButton.propTypes = {
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default BadgeButton;
