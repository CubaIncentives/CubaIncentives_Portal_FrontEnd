import validator from 'validator';

import { PASSWORD_REGEX } from '@/utils/constants';
import {
  INVALID_PASSWORD,
  REQUIRED_FIELD,
  SAME_PASSWORD,
} from '@/utils/validationMessages';

function changePassValidations(data) {
  const errors = {};

  if (validator.isEmpty(data.oldPassword.trim()))
    errors.oldPassword = REQUIRED_FIELD;
  if (validator.isEmpty(data.newPassword.trim()))
    errors.newPassword = REQUIRED_FIELD;
  else if (!PASSWORD_REGEX.test(data?.newPassword))
    errors.newPassword = INVALID_PASSWORD;
  if (validator.isEmpty(data?.confirmPassword?.trim()))
    errors.confirmPassword = REQUIRED_FIELD;
  else if (!validator.equals(data?.newPassword, data?.confirmPassword)) {
    errors.confirmPassword = SAME_PASSWORD;
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default changePassValidations;
