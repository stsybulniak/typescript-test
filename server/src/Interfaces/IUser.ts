import { Document } from 'mongoose';

export default interface IUser extends Document {
  _id: string;
  password: string;
  email: string;
  name: string;
  refreshToken: string;
  googleId?: string;
}
