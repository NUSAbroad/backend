import { Module, University, Mapping } from '../../models';

declare module 'express' {
  interface Request {
    university?: University;
    module?: Module;
    mapping?: Mapping;
  }
}
