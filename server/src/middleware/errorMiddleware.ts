import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import ValidationException from '../exceptions/ValidationException';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

function errorMiddleware(
  error: HttpException | ValidationException,
  req: Request & { t: Function },
  res: Response,
  next: NextFunction
) {
  if (error instanceof ValidationException) {
    const { status, data } = error;
    res.status(status).json({ errors: data });
  } else {
    const status = error.status || INTERNAL_SERVER_ERROR;
    const message = error.message || req.t('errors:serverErrors.errorOccured');
    res.status(status).send({ error: { status, message } });
  }
}

export default errorMiddleware;
