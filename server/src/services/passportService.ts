import passport from 'passport';
import UserModel from '../models/UserModel';
import bcrypt from 'bcryptjs';
import LocalStrategy from 'passport-local';
import PassportJwt from 'passport-jwt';
import GoogleStrategy from 'passport-google-oauth20';

import RefreshTokenStrategy from './RefreshTokenStrategy';
import mongoose from 'mongoose';

const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;

export const initLocalStrategy = (): void => {
  const _LocalStrategy: any = LocalStrategy; // avoid IDE error
  const localLogin = new _LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done: Function): Promise<void> => {
      try {
        const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
        if (user) {
          const isMatch = await bcrypt.compare(String(password).trim(), user.password);
          if (isMatch) {
            done(null, user);
          } else {
            done(null, false, { message: 'errors:auth:invalidCredentials' });
          }
        } else {
          done(null, false, { message: 'errors:auth:invalidCredentials' });
        }
      } catch (err) {
        done(err, null);
      }
    }
  );
  passport.use(localLogin);
};

export const initJwtStrategy = () => {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.SECRET_KEY
  };

  const jwtLogin = new JwtStrategy(
    jwtOptions,
    async (payload, done): Promise<void> => {
      try {
        const user = await UserModel.findById(payload.sub);
        if (user) {
          done(null, user);
        } else {
          done(null, false, { message: 'errors:clientErrors.notFound' });
        }
      } catch (err) {
        done(err, false);
      }
    }
  );

  passport.use(jwtLogin);
};

export const initGoogleStrategy = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
  const googleLogin = new GoogleStrategy.Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST_URL}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const existingUser = await UserModel.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
          existingUser.googleId = profile.id;
          done(null, existingUser);
        } else {
          const user = await new UserModel({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            googleId: profile.id
          }); //.save();
          done(null, user);
        }
      } catch (err) {
        done(err);
      }
    }
  );

  passport.use(googleLogin);
};

export const initRefreshTokenStrategy = () => {
  const options = {
    jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
    secret: process.env.REFRESH_SECRET_KEY
  };

  const refreshToken = new RefreshTokenStrategy(
    options,
    async (payload, done): Promise<void> => {
      const { sub, _token } = payload;

      try {
        const user = await UserModel.findById(sub);
        if (user && _token === user.refreshToken) {
          done(null, user);
        } else if (user && _token !== user.refreshToken) {
          done(null, false, { message: 'errors:auth.tokenDecline' });
        } else {
          done(null, false, { message: 'clientErrors:user.notFound' });
        }
      } catch (err) {
        done(err, false);
      }
    }
  );

  passport.use(refreshToken);
};
