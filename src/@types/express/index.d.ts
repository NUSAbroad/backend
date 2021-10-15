import { Module, University, Mapping, Country, Link } from '../../models';

declare module 'express' {
  interface Request {
    university?: University;
    module?: Module;
    mapping?: Mapping;
    country?: Country;
    link?: Link;

    file?: Express.Multer.File;
  }
}
