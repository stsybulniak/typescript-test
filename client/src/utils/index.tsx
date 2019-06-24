import { get } from 'lodash';

export const getErrorMessage = (err: any) => {
  const errors = get(err, 'response.data.errors', []);
  if (errors.length) {
    const errorsArr = [];
    for (const error of errors) {
      errorsArr.push(`${error.message}\n`);
    }
    return errorsArr;
  }
  return get(err, 'response.data.error.message') || get(err, 'message', 'Error Occurred');
};
