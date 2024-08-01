export const PAGE_TITLE_SUFFIX = ' | Cuba Incentives';
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const CURRENCY = '$';
export const PHONE_CODE = '(+53)';

export const MESSAGE = {
  SUCCESS: 'Success.',
  ERROR: 'Something went wrong.',
  UNAUTHORIZED: 'Unauthorized',
};

export const RESPONSE_CODE = {
  SUCCESS: 200,
  SUCCESS_NEW_RESOURCE: 201,
  SUCCESS_WITHOUT_RESPONSE: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  INTERNAL_SERVER: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const DATE_PRICEFIELDS_KEYS = [
  'price_per_person',
  'taxi_price_two_pax',
  'minibus_price_three_pax',
  'minibus_price_four_pax',
  'minibus_price_five_pax',
  'minibus_price_six_pax',
  'minibus_price_seven_pax',
  'minibus_price_eight_pax',
];

export const NotificationModalTitle = 'Important notes';
