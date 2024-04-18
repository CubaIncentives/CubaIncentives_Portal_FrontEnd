import React from 'react';
import PropTypes from 'prop-types';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { classNames } from '@/utils/helper';

const CommonDropdown = ({
  menuToggle,
  children,
  menuOption,
  DropdownBody,
  wrapperRef,
  setMenuToggle,
  isOutsideClick = true,
  customClass,
  ...restProps
}) => {
  useOutsideClick(wrapperRef, () => {
    if (menuToggle && isOutsideClick) setMenuToggle(false);
  });

  return (
    <div>
      {children ? children : null}
      <div
        className={classNames(
          'transition-opacity duration-500 scale-0',
          menuToggle ? 'opacity-100 scale-100' : 'opacity-0'
        )}
      >
        <div
          className={classNames(
            'absolute right-0 z-10 mt-2.5  origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'
          )}
        >
          {menuOption?.map((item, index) => {
            return (
              <div
                {...restProps}
                key={index}
                onClick={() => setMenuToggle(false)}
                className={classNames(
                  'text-sm whitespace-nowrap hover:bg-gray-100',
                  customClass
                )}
              >
                {item?.render()}
              </div>
            );
          })}
          {DropdownBody && <DropdownBody />}
        </div>
      </div>
    </div>
  );
};

CommonDropdown.propTypes = {
  menuToggle: PropTypes.bool.isRequired,
  children: PropTypes.node,
  menuOption: PropTypes.array,
  DropdownBody: PropTypes.any,
  setMenuToggle: PropTypes.func,
  wrapperRef: PropTypes.object,
  isOutsideClick: PropTypes.bool,
  customClass: PropTypes.string,
};
export default CommonDropdown;
