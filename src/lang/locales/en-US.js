export const dateTimeFormats = {
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  long: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  },
};

export default {
  api_url: 'API URL',
  email_address: 'Email Address',
  email: 'Email',
  enter_value: 'Enter Value',
  errors: {
    '-1': 'Couldn\'t reach API',
    100: 'Wrong username and/or password',
    101: 'Invalid access token',
    102: 'Expired access token',
    103: 'User inactive',
  },
  login: 'Log in',
  other: 'Other',
  password: 'Password',
  powered_by_directus: 'Powered by Directus',
  values: 'Values',
  version: 'Version',
};
