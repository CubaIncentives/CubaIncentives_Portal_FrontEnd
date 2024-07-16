import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import PropTypes from 'prop-types';

import { classNames } from '@/utils/helper';

const ToggleSwitch = ({ handleToggleChange, toggleValue, disabled }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(toggleValue);
  }, [toggleValue]);

  const handleChange = () => {
    const newValue = !enabled;

    handleToggleChange(newValue);
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      disabled={disabled}
      className={classNames(
        enabled ? 'bg-palette8' : 'bg-gray-300',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
      )}
    >
      <span className='sr-only'>Use setting</span>
      <span
        aria-hidden='true'
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        )}
      />
    </Switch>
  );
};

ToggleSwitch.propTypes = {
  handleToggleChange: PropTypes.func,
  toggleValue: PropTypes.bool,
  disabled: PropTypes.bool,
  data: PropTypes.object,
};

export default ToggleSwitch;
