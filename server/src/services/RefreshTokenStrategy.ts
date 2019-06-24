import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

class RefreshTokenStrategy extends passport.Strategy {
  protected jwtFromRequest: Function;
  protected secret: string;
  protected verify: Function;

  constructor(options: { jwtFromRequest: Function; secret: string }, verify: Function) {
    super();
    this.name = 'refresh-jwt-token';
    const { jwtFromRequest, secret } = options;
    this.jwtFromRequest = jwtFromRequest;
    this.secret = secret;
    this.verify = verify.bind(this);
  }

  authenticate(req: Request, options: Object) {
    const token = this.jwtFromRequest(req);

    if (!token) {
      throw new Error('No auth token');
    }

    if (!this.secret) {
      throw new Error('Incorect options');
    }

    jwt.verify(token, this.secret, (err, decoded) => {
      if (err) {
        return this.fail(err);
      } else {
        const verified = (err, user, info) => {
          if (err) {
            return this.error(err);
          } else if (!user) {
            return this.fail(info);
          } else {
            return this.success(user, info);
          }
        };

        try {
          this.verify({ ...decoded, _token: token }, verified);
        } catch (ex) {
          this.error(ex);
        }
      }
    });
  }
}

export default RefreshTokenStrategy;
