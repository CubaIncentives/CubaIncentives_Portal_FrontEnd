import validator from 'validator';

import { PASSWORD_REGEX } from '@/utils/constants';
import {
  CONFIRM_PASSWORD,
  INVALID_PASSWORD,
  REQUIRED_PASSWORD,
  SAME_PASSWORD,
} from '@/utils/validationMessages';

function resetPasswordValidation(data) {
  const errors = {};

  if (validator.isEmpty(data?.password?.trim()))
    errors.password = REQUIRED_PASSWORD;
  else if (!PASSWORD_REGEX.test(data?.password))
    errors.password = INVALID_PASSWORD;
  if (validator.isEmpty(data?.confirmPassword?.trim()))
    errors.confirmPassword = CONFIRM_PASSWORD;
  else if (!validator.equals(data?.password, data?.confirmPassword)) {
    errors.confirmPassword = SAME_PASSWORD;
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default resetPasswordValidation;
