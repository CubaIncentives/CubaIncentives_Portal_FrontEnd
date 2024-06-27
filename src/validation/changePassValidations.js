import validator from 'validator';

import { PASSWORD_REGEX } from '@/utils/constants';
import {
  CONFIRM_PASSWORD,
  INVALID_PASSWORD,
  NEW_PASSWORD,
  OLD_PASSWORD,
  SAME_PASSWORD,
} from '@/utils/validationMessages';

function changePassValidations(data) {
  const errors = {};

  if (validator.isEmpty(data.oldPassword.trim()))
    errors.oldPassword = OLD_PASSWORD;
  if (validator.isEmpty(data.newPassword.trim()))
    errors.newPassword = NEW_PASSWORD;
  else if (!PASSWORD_REGEX.test(data?.newPassword))
    errors.newPassword = INVALID_PASSWORD;
  if (validator.isEmpty(data?.confirmPassword?.trim()))
    errors.confirmPassword = CONFIRM_PASSWORD;
  else if (!PASSWORD_REGEX.test(data?.confirmPassword))
    errors.confirmPassword = INVALID_PASSWORD;
  else if (!validator.equals(data?.newPassword, data?.confirmPassword)) {
    errors.confirmPassword = SAME_PASSWORD;
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default changePassValidations;
