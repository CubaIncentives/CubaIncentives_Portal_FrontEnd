export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const SPECIAL_CHAR_NOT_ALLOW_REGEX = /^[a-zA-Z0-9_-]+$/;
export const IS_ALPHA_NUMERIC = /^[a-z0-9]*$/i;
export const IS_ALPHA_NUMERIC_WITH_SPACE = /^[a-z0-9 ]*$/i;
export const NUMBER_REGEX = /^[0-9 ]*$/i;
export const DECIMAL_NUMBER_REGEX = /^[0-9]*\.?[0-9]*$/i;
export const CHAR_WITH_DASH = /^[a-zA-Z0-9-]*$/;

export const MESSAGE = {
  SUCCESS: 'Success.',
  ERROR: 'Something went wrong.',
  UNAUTHORIZED: 'Unauthorized',
};
