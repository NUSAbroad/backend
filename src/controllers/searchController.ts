import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import University from '../models/University';
import { NUSSLUG } from '../consts';
import { cleanInput } from '../utils/search';
import { formatUniversities, addFoundIn } from '../utils/universities';
import { getAllUniversityInclude } from '../controllers/universityController';
import { Faculty, Module } from '../models';
import { NUS_TYPE } from '../consts/faculty';
import { BadRequest } from 'http-errors';
import { getOrSetCache } from '../utils/redis';
import {
  SEARCH_FACULTY_KEY,
  SEARCH_GENERAL_KEY,
  SEARCH_MODULE_CODE,
  SEARCH_MODULE_NAME
} from '../consts/redis';

const UNIVERSITY = 'University Name';
const MAPPINGS = 'Module Mappings';
const autofillAttributes = ['name', 'faculty', 'code', 'credits'];
const foundInTerms: { [key: number]: string[] } = {
  3: [UNIVERSITY, MAPPINGS],
  2: [UNIVERSITY],
  1: [MAPPINGS]
};

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

    const queryString = `
        SELECT DISTINCT COALESCE(U.id, M.id) as id, (COALESCE(U.rank,0) + COALESCE(M.rank,0)) as rank FROM
        (SELECT "id", ${universityRank} AS rank
        FROM "Universities"
        WHERE _search @@ to_tsquery('english', '${query}:*') AND slug != '${NUSSLUG}') U
        FULL OUTER JOIN
        (SELECT "partnerUniversityId" AS "id", ${moduleRank} AS rank
        FROM "Mappings"
        WHERE _search @@ to_tsquery('english', '${query}:*')) M
        ON U.id=M.id
        ORDER BY rank DESC
        `;

    const universitiesAndRanks = await University.sequelize!.query(queryString, {
      model: University,
      replacements: { query: query },
      raw: true
    });

    // Let sequelize retrieve the associations
    // Do individual search to keep the order of ids in tact
    const result = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      universitiesAndRanks.map(async (university: any) => {
        const universityWithAssociation = await University.findByPk(university.id, {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: getAllUniversityInclude()
        });

        const foundIn = foundInTerms[university.rank];
        return await addFoundIn(universityWithAssociation!, foundIn);
      })
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function searchAllUniversities(req: Request, res: Response, next: NextFunction) {
  try {
    const universities = await getOrSetCache(SEARCH_GENERAL_KEY, fetchAllUniversities);

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
    const faculties = await getOrSetCache(SEARCH_FACULTY_KEY, fetchAllFaculties);

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
    const modules = await getOrSetCache(SEARCH_MODULE_NAME, fetchAllModuleNames);

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
    const modules = await getOrSetCache(SEARCH_MODULE_CODE, fetchAllModuleCodes);

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
