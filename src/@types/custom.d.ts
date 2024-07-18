import { Request } from 'express';
import { User } from './user.entity';
declare module 'express' {
  interface Request {
    user?: User;
  }
}
