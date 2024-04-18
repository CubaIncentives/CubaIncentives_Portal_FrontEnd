import validator from 'validator';

import { PASSWORD_REGEX } from '@/utils/constants';
import {
  INVALID_PASSWORD,
  REQUIRED_FIELD,
  SAME_PASSWORD,
} from '@/utils/validationMessages';

function resetPasswordValidation(data) {
  const errors = {};

  if (validator.isEmpty(data?.password?.trim()))
    errors.password = REQUIRED_FIELD;
  else if (!PASSWORD_REGEX.test(data?.password))
    errors.password = INVALID_PASSWORD;
  if (validator.isEmpty(data?.confirmPassword?.trim()))
    errors.confirmPassword = REQUIRED_FIELD;
  else if (!validator.equals(data?.password, data?.confirmPassword)) {
    errors.confirmPassword = SAME_PASSWORD;
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default resetPasswordValidation;
