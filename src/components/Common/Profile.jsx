import PropTypes from 'prop-types';

import { RANDOM_BACKGROUND_COLOR_VALUES } from '@/utils/constants';
import { classNames, getInitials } from '@/utils/helper';
import UserIcon from '@/assets/images/user-01.svg';

const Profile = ({
  employeeName,
  profilePicture,
  customClass = '',
  colorKey = 0,
  textClass = '',
}) => {
  return (
    <>
      {profilePicture ? (
        <img
          src={profilePicture}
          className={classNames('w-12 h-12 mb-0.5 rounded-full', customClass)}
          alt={'profile img'}
          title={employeeName}
        />
      ) : employeeName && employeeName.trim() ? (
        <span
          className={classNames(
            'inline-flex h-12 w-12 items-center justify-center rounded-full bg-warning-500',
            RANDOM_BACKGROUND_COLOR_VALUES[colorKey],
            customClass
          )}
        >
          <span
            className={classNames(
              'text-xs font-medium leading-none text-white uppercase',
              textClass
            )}
          >
            {getInitials(employeeName)}
          </span>
        </span>
      ) : (
        <img
          className={classNames('w-12 h-12 mb-0.5 rounded-full', customClass)}
          title=''
          src={UserIcon}
        />
      )}
    </>
  );
};

Profile.propTypes = {
  employeeName: PropTypes.string,
  profilePicture: PropTypes.string,
  customClass: PropTypes.string,
  colorKey: PropTypes.number,
  textClass: PropTypes.string,
};

export default Profile;
