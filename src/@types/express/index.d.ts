import { Module, University, Mapping } from '../../models';

declare module 'express' {
  interface Request {
    university?: University;

    file?: Express.Multer.File;
    module?: Module;
    mapping?: Mapping;
  }
}
