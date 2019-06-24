import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';
import IUser from '../Interfaces/IUser';
import { CREATED } from 'http-status-codes';
import mongoose from 'mongoose';

export default class AuthtController {
  constructor() {
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.oauthSignin = this.oauthSignin.bind(this);
  }

  private generateToken(user: IUser): { token: string; refreshToken: string } {
    const { SECRET_KEY, TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE, REFRESH_SECRET_KEY } = process.env;

    const expToken = Math.floor(Date.now() / 1000) + 60 * Number(TOKEN_EXPIRE);
    const token = jwt.sign({ sub: user._id, exp: expToken }, SECRET_KEY);
    const expRefresh = Math.floor(Date.now() / 1000) + 60 * Number(REFRESH_TOKEN_EXPIRE);
    const refreshToken = jwt.sign({ sub: user._id, exp: expRefresh }, REFRESH_SECRET_KEY);

    return { token, refreshToken };
  }

  public async signin(req: Request, res: Response, next: NextFunction) {
    const { user } = req;

    try {
      const { token, refreshToken } = this.generateToken(user);
      await user.updateOne({ refreshToken });
      res.send({ token, refreshToken, user });
    } catch (err) {
      next(err);
    }
  }

  public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password, name } = req.body;
    try {
      const user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password
      });
      const { token, refreshToken } = this.generateToken(user);
      user.refreshToken = refreshToken;
      await user.save();
      user.password = undefined;
      user.refreshToken = undefined;

      res.status(CREATED).send({ token, refreshToken, user });
    } catch (err) {
      next(err);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    const { user } = req;

    try {
      const { token, refreshToken } = this.generateToken(user);
      await user.updateOne({ refreshToken });
      res.send({ token, refreshToken, user });
    } catch (err) {
      next(err);
    }
  }

  public async oauthSignin(req: Request, res: Response, next: NextFunction) {
    const { user } = req;

    try {
      const { token, refreshToken } = this.generateToken(user);
      user.refreshToken = refreshToken;
      await UserModel.findOneAndUpdate({ _id: user._id }, user, { upsert: true, new: true });
      const io = req.app.get('io');
      io.in(req.session.socketId).emit('google', { token, refreshToken, user });
      res.end();
    } catch (err) {
      next(err);
    }
  }
}
