import mongoose from 'mongoose';
import IUser from '../Interfaces/IUser';
import ValidationException from '../exceptions/ValidationException';
import App from '../app';
import { UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { isEmpty } from 'lodash';
import bcrypt from 'bcryptjs';
import { isEmail } from 'validator';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'errors:validation.fieldRequired'],
      lowercase: true,
      trim: true,
      validate: {
        type: 'isValidAndUniqueEmail',
        isAsync: true,
        validator: async function(email: string, cb: Function) {
          if (!isEmail(email)) {
            return cb(false);
          }
          try {
            const user = await mongoose.model('User').findOne({ email });
            if (user) {
              cb(false, 'errors:validation:duplicateField');
            } else {
              cb(true);
            }
          } catch (err) {
            cb(false, err.message);
          }
        },
        message: () => 'errors:validation.emailNotValid'
      }
    },
    name: {
      type: String,
      required: [true, 'errors:validation.fieldRequired'],
      trim: true
    },
    refreshToken: String,
    password: {
      type: String,
      trim: true,
      minlength: [6, 'errors:validation.shotPassword'],
      required: false //[true, 'errors:validation.fieldRequired'],
    },
    googleId: String
  },
  {
    timestamps: true
  }
);

userSchema.post('save', function(err, doc, next) {
  const result = [];
  if (!isEmpty(err.errors)) {
    Object.keys(err.errors).forEach(key => {
      const { properties } = err.errors[key];
      const transOptions = { ...properties };
      delete transOptions.validator;
      result.push({ message: App.i18n.t(properties.message, transOptions), field: properties.path });
    });
    const errorResult = new ValidationException(UNPROCESSABLE_ENTITY, result);

    return next(errorResult);
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    const data = [{ message: App.i18n.t('errors:validation.duplicateValue') }];
    return next(new ValidationException(UNPROCESSABLE_ENTITY, data));
  }

  next();
});

userSchema.pre<IUser>('save', async function(next) {
  if (this.password) {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
  }
  next();
});

export default mongoose.model<IUser>('User', userSchema);
