import { Module, University, Mapping, Country, Link, Semester } from '../../models';

declare module 'express' {
  interface Request {
    university?: University;
    module?: Module;
    mapping?: Mapping;
    country?: Country;
    link?: Link;
    semester?: Semester;

    file?: Express.Multer.File;
  }
}
