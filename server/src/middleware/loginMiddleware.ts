import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import HttpException from '../exceptions/HttpException';
import IUser from '../Interfaces/IUser';
import { UNAUTHORIZED } from 'http-status-codes';

export default (req: Request & { t: Function }, res: Response, next: NextFunction): void => {
  passport.authenticate('local', { session: false }, (err, user: IUser, info: { message: string }): void => {
    if (err) return next(err);

    if (!user) return next(new HttpException(UNAUTHORIZED, req.t(info.message)));

    user.password = undefined;
    user.refreshToken = undefined;
    req.user = user;
    next();
  })(req, res, next);
};
