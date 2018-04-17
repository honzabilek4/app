import base64 from 'base-64';
import { isNumber } from 'lodash';

export function tokenPayload(state) { // eslint-disable-line import/prefer-default-export
  if (state.token) {
    const token = state.token;
    const payloadBase64 = token.split('.')[1].replace('-', '+').replace('_', '/');
    const payloadDecoded = base64.decode(payloadBase64);
    const payloadObject = JSON.parse(payloadDecoded);

    if (isNumber(payloadObject.exp)) {
      payloadObject.exp = new Date(payloadObject.exp * 1000);
    }

    return payloadObject;
  }

  return null;
}
