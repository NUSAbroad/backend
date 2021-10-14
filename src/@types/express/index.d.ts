import { Module, University, Mapping, Country } from '../../models';

declare module 'express' {
  interface Request {
    university?: University;
    module?: Module;
    mapping?: Mapping;
    country?: Country;

    file?: Express.Multer.File;
  }
}
