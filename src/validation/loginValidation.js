import validator from 'validator';

function loginValidation(data) {
  const errors = {};

  if (validator.isEmpty(data.email.trim()))
    errors.email = 'Please enter the registered email address.';
  else if (!validator.isEmail(data.email))
    errors.email = 'Please enter valid email address.';

  if (validator.isEmpty(data.password.trim()))
    errors.password = 'Please enter password.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default loginValidation;
