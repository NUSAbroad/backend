import { University } from '../../models';

declare module 'express' {
  interface Request {
    university?: University;

    file?: Express.Multer.File;
  }
}
