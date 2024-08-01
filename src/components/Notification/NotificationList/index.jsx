import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';

const NotificationList = (props) => {
  const { notifications, parentCss } = props;
  const { important, information } = notifications;
  const filteredNotifications = { important, information };

  return (filteredNotifications &&
    filteredNotifications?.important &&
    filteredNotifications?.important.length > 0) ||
    (filteredNotifications?.information &&
      filteredNotifications?.information.length > 0) ? (
    <div className={classNames('flex flex-col gap-2.5 p-4', parentCss)}>
      {Object.entries(filteredNotifications).map(([category, items]) => (
        <React.Fragment key={category}>
          {items.length > 0
            ? items.map((item) => (
                <p
                  className={classNames(
                    ' p-2.5 px-3.5 text-customBlack text-sm border rounded-md font-medium italic',
                    category === 'important'
                      ? 'bg-red-100  border-red-300'
                      : 'bg-[#FFF9E5]  border-secondaryColor'
                  )}
                  key={item?.id}
                >
                  {item.message}
                </p>
              ))
            : null}
        </React.Fragment>
      ))}
    </div>
  ) : null;
};

NotificationList.propTypes = {
  notifications: PropTypes.object,
  parentCss: PropTypes.string,
};

export default NotificationList;
