import HttpException from './HttpException';

class ValidationException extends HttpException {
  constructor(public status: number, public data: Array<Object> = []) {
    super(status, 'Validation errors');
    this.data = data;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

export default ValidationException;
