import { NextFunction, Request, Response } from 'express';

export default (
  req: Request & { t: Function; session: { socketId: string } },
  res: Response,
  next: NextFunction
): void => {
  req.session.socketId = req.query.socketId;
  next();
};
