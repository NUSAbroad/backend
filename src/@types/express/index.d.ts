import { University } from '../../models';

declare module 'express' {
  interface Request {
    university?: University;
  }
}
