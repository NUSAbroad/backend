import { Module, University, Mapping, Country, Link, Semester, Faculty, User } from '../../models';

declare module 'express' {
  interface Request {
    university?: University;
    module?: Module;
    mapping?: Mapping;
    country?: Country;
    link?: Link;
    semester?: Semester;
    faculty?: Faculty;
    user?: User;

    file?: Express.Multer.File;
  }
}
