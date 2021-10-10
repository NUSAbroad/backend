import { Module, University } from '../../models';
import Mapping from '../../models/Mapping';

declare module 'express' {
  interface Request {
    university?: University;
    module?: Module;
    mapping?: Mapping;
  }
}
