import { Module, University, Mapping, Country, Link, Semester, Faculty } from '../../models';

declare module 'express' {
  interface Request {
    university?: University;
    module?: Module;
    mapping?: Mapping;
    country?: Country;
    link?: Link;
    semester?: Semester;
    faculty?: Faculty;

    file?: Express.Multer.File;
  }
}
