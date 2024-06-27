import validator from 'validator';

import { INVALID_EMAIL, REGISTERED_EMAIL } from '@/utils/validationMessages';

function forgotPassValidation(data) {
  const errors = {};

  if (validator.isEmpty(data.email.trim())) errors.email = REGISTERED_EMAIL;
  else if (!validator.isEmail(data.email)) errors.email = INVALID_EMAIL;

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default forgotPassValidation;
