import { Request, Response, NextFunction } from 'express';
import { Module, University, Faculty } from '../models';
import { NotFound, BadRequest } from 'http-errors';
import axios, { AxiosResponse } from 'axios';
import { NUS_MODS_MODULES_INFO_URL } from '../consts';
import { ModuleInfo, formatModules } from '../utils/modules';
import { ModuleCreationAttributes } from '../models/Module';
import { getFacultyAcronym, getFacultyIds } from '../utils/faculties';
import { FacultyCreationAttributes } from '../models/Faculty';
import { Transaction } from 'sequelize';
import sequelize from '../database';
import { NUS_TYPE } from '../consts/faculty';

async function retrieveModule(req: Request, res: Response, next: NextFunction) {
  try {
    const module = await Module.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!module) throw new NotFound('No module with this id!');

    req.module = module;
    next();
  } catch (err) {
    next(err);
  }
}

async function indexModule(req: Request, res: Response, next: NextFunction) {
  try {
    const modules = await Module.findAll({
      order: [['id', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

async function showModule(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(req.module);
  } catch (err) {
    next(err);
  }
}

async function createModule(req: Request, res: Response, next: NextFunction) {
  try {
    const module = await Module.create(req.body);
    res.status(201).json(module);
  } catch (err) {
    next(err);
  }
}

async function updateModule(req: Request, res: Response, next: NextFunction) {
  try {
    const module = await req.module!.update(req.body);
    res.status(200).json(module);
  } catch (err) {
    next(err);
  }
}

async function destroyModule(req: Request, res: Response, next: NextFunction) {
  try {
    await req.module!.destroy();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

async function resetModule(req: Request, res: Response, next: NextFunction) {
  try {
    await Module.destroy({
      where: {}
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

async function populateModule(req: Request, res: Response, next: NextFunction) {
  const t: Transaction = await sequelize.transaction();
  try {
    if (!req.body.year) throw new BadRequest('Not academic year specified');

    const response: AxiosResponse = await axios.get(
      NUS_MODS_MODULES_INFO_URL + `/${req.body.year}/moduleInfo.json`
    );

    let modulesInfo: ModuleInfo[] = response.data;

    const nusUniversity = await University.findOne({
      where: {
        name: 'National University of Singapore'
      }
    });

    if (!nusUniversity) throw new BadRequest('NUS University not found!');

    const nusId = nusUniversity.id;

    const facultiesSet = new Set<String>();

    modulesInfo = modulesInfo.map((moduleInfo: ModuleInfo) => {
      const acronym = getFacultyAcronym(moduleInfo.faculty);
      facultiesSet.add(acronym);
      moduleInfo.faculty = acronym;

      return moduleInfo;
    });

    const faculties = [...facultiesSet.values()];

    const facultyCreationAttributes: FacultyCreationAttributes[] = faculties.map(
      (faculty: String) => {
        return {
          name: faculty as string,
          type: NUS_TYPE,
          universityId: nusId
        };
      }
    );

    await Faculty.bulkCreate(facultyCreationAttributes, {
      ignoreDuplicates: true,
      transaction: t
    });

    const formattedModules: ModuleCreationAttributes[] = await getFacultyIds(
      formatModules(modulesInfo, nusId),
      t
    );

    const modules = await Module.bulkCreate(formattedModules, {
      ignoreDuplicates: true,
      transaction: t
    });

    await t.commit();

    res.status(201).json(modules);
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

export const indexModuleFuncs = [indexModule];
export const showModuleFuncs = [retrieveModule, showModule];
export const createModuleFuncs = [createModule];
export const updateModuleFuncs = [retrieveModule, updateModule];
export const destroyModuleFuncs = [retrieveModule, destroyModule];
export const populateModuleFuncs = [populateModule];
export const resetModuleFuncs = [resetModule];
