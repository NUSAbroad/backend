import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import University from '../models/University';
import { NUSSLUG } from '../consts';
import { cleanInput } from '../utils/search';
import { formatUniversities } from '../utils/universities';
import { getAllUniversityInclude } from '../controllers/universityController';
import { Faculty, Module } from '../models';
import { NUS_TYPE } from '../consts/faculty';
import { BadRequest } from 'http-errors';
import { getOrSetCache } from '../utils/redis';

const autofillAttributes = ['name', 'faculty', 'code'];

async function fetchAllUniversities() {
  const universities = await University.findAll({
    order: [['name', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      slug: {
        [Op.ne]: NUSSLUG
      }
    },
    include: getAllUniversityInclude()
  });

  const result = await formatUniversities(universities);
  return result;
}

async function fetchAllFaculties() {
  const faculties = await Faculty.findAll({
    order: [['name', 'ASC']],
    where: {
      type: NUS_TYPE
    },
    attributes: ['name']
  });
  return faculties;
}

async function fetchAllModuleNames() {
  const nus = await University.findOne({
    where: {
      slug: NUSSLUG
    }
  });

  if (!nus) new BadRequest('Unable to find NUS entry');

  const modules = await Module.findAll({
    order: [['name', 'ASC']],
    where: {
      universityId: nus!.id
    },
    attributes: autofillAttributes
  });

  return modules;
}

async function fetchAllModuleCodes() {
  const nus = await University.findOne({
    where: {
      slug: NUSSLUG
    }
  });

  if (!nus) new BadRequest('Unable to find NUS entry');

  const modules = await Module.findAll({
    order: [['code', 'ASC']],
    where: {
      universityId: nus!.id
    },
    attributes: autofillAttributes
  });

  return modules;
}

async function searchUniversities(req: Request, res: Response, next: NextFunction) {
  try {
    const query = cleanInput(req.params.query);

    const universityRank = 2;
    const moduleRank = 1;

    const queryString = `(SELECT "id", ${universityRank} AS rank
        FROM "Universities"
        WHERE _search @@ to_tsquery('english', '${query}:*') AND slug != '${NUSSLUG}') 
        UNION 
        (SELECT "partnerUniversityId" AS "id", ${moduleRank} AS rank
        FROM "Mappings"
        WHERE _search @@ to_tsquery('english', '${query}:*'))
        ORDER BY rank DESC
        `;

    const universitiesIds = await University.sequelize!.query(queryString, {
      model: University,
      replacements: { query: query }
    });

    // Let sequelize retrieve the associations
    const searchResult = await Promise.all(
      universitiesIds.map(async university => {
        const universityWithAssociations = await University.findByPk(university.id, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: getAllUniversityInclude()
        });

        return universityWithAssociations;
      })
    );

    const result = await formatUniversities(searchResult as University[]);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function searchAllUniversities(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.originalUrl; // Will be /search/general
    const universities = await getOrSetCache(key, fetchAllUniversities);

    res.status(200).json(universities);
  } catch (err) {
    next(err);
  }
}

async function searchFaculties(req: Request, res: Response, next: NextFunction) {
  try {
    const faculties = await Faculty.findAll({
      where: {
        type: NUS_TYPE,
        name: {
          [Op.iLike]: `${req.params.query.trim()}%`
        }
      },
      attributes: ['name'],
      order: [['name', 'ASC']]
    });

    res.status(200).json(faculties);
  } catch (err) {
    next(err);
  }
}

async function searchAllFaculties(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.originalUrl; // Will be /search/faculty
    const faculties = await getOrSetCache(key, fetchAllFaculties);

    res.status(200).json(faculties);
  } catch (err) {
    next(err);
  }
}

async function searchModuleNames(req: Request, res: Response, next: NextFunction) {
  try {
    const nus = await University.findOne({
      where: {
        slug: NUSSLUG
      }
    });

    if (!nus) new BadRequest('Unable to find NUS entry');

    const modules = await Module.findAll({
      where: {
        name: {
          [Op.iLike]: `${req.params.query.trim()}%`
        },
        universityId: nus!.id
      },
      attributes: autofillAttributes,
      order: [['name', 'ASC']]
    });

    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

async function searchAllModuleNames(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.originalUrl; // Will be /search/moduleName
    const modules = await getOrSetCache(key, fetchAllModuleNames);

    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

async function searchModuleCode(req: Request, res: Response, next: NextFunction) {
  try {
    const nus = await University.findOne({
      where: {
        slug: NUSSLUG
      }
    });

    if (!nus) new BadRequest('Unable to find NUS entry');

    const modules = await Module.findAll({
      where: {
        code: {
          [Op.iLike]: `${req.params.query.trim()}%`
        },
        universityId: nus!.id
      },
      attributes: autofillAttributes,
      order: [['code', 'ASC']]
    });

    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

async function searchAllModuleCode(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.originalUrl; // Will be /search/moduleCode
    const modules = await getOrSetCache(key, fetchAllModuleCodes);

    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

export const searchFuncs = [searchUniversities];
export const searchAllFuncs = [searchAllUniversities];
export const searchFacultiesFuncs = [searchFaculties];
export const searchAllFacultiesFuncs = [searchAllFaculties];
export const searchModuleNameFuncs = [searchModuleNames];
export const searchAllModuleNameFuncs = [searchAllModuleNames];
export const searchModuleCodeFuncs = [searchModuleCode];
export const searchAllModuleCodeFuncs = [searchAllModuleCode];
