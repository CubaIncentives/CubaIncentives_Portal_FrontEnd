import PropTypes from 'prop-types';

const NotificationListModal = (props) => {
  const { notifications } = props;

  const { pop_up: NotificationData } = notifications;

  return NotificationData && NotificationData.length > 0 ? (
    <div className='flex flex-col gap-2.5 max-h-96  h-full overflow-auto'>
      {NotificationData.map((item, index) => (
        <div className='flex flex-row gap-2' key={index}>
          <span className='text-customBlack text-sm font-medium italic break-all text-wrap'>
            {index + 1}.
          </span>

          <span
            className='  text-customBlack text-sm font-medium italic break-all text-wrap '
            key={item?.id}
          >
            {item.message}
          </span>
        </div>
      ))}
    </div>
  ) : null;
};

NotificationListModal.propTypes = {
  notifications: PropTypes.object,
};

export default NotificationListModal;
