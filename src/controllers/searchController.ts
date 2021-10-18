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

async function searchUniversities(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.params.query) {
      const universities = await University.findAll({
        order: [['id', 'ASC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
          slug: {
            [Op.ne]: NUSSLUG
          }
        },
        include: getAllUniversityInclude()
      });

      const result = await formatUniversities(universities);

      res.status(200).json(result);
      return;
    }

    const query = cleanInput(req.params.query);

    const queryString = `SELECT *
      FROM "Universities"
      WHERE (id IN (
        SELECT "partnerUniversityId"
        FROM "Mappings"
        WHERE _search @@ to_tsquery('english', '${query}:*')
      ) OR id IN (
        SELECT "id"
        FROM "Universities"
        WHERE _search @@ to_tsquery('english', '${query}:*')
      )) AND slug != '${NUSSLUG}'`;

    const universities = await University.sequelize!.query(queryString, {
      model: University,
      replacements: { query: query }
    });

    const universitiesIds = universities.map(university => university.id);

    // Added this because FE needs the associations, checked the search timing its still pretty fast ~200ms
    const searchResult = await University.findAll({
      where: {
        id: universitiesIds
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: getAllUniversityInclude(),
      order: [['id', 'ASC']]
    });

    const result = await formatUniversities(searchResult);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function searchFaculties(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.params.query) {
      const faculties = await Faculty.findAll({
        order: [['name', 'ASC']],
        where: {
          type: NUS_TYPE
        },
        attributes: ['name']
      });

      res.status(200).json(faculties);
      return;
    }

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

async function searchModuleNames(req: Request, res: Response, next: NextFunction) {
  try {
    const nus = await University.findOne({
      where: {
        slug: NUSSLUG
      }
    });

    if (!nus) new BadRequest('Unable to find NUS entry');

    if (!req.params.query) {
      const modules = await Module.findAll({
        order: [['name', 'ASC']],
        where: {
          universityId: nus!.id
        },
        attributes: ['name']
      });

      res.status(200).json(modules);
      return;
    }

    const modules = await Module.findAll({
      where: {
        name: {
          [Op.iLike]: `${req.params.query.trim()}%`
        },
        universityId: nus!.id
      },
      attributes: ['name'],
      order: [['name', 'ASC']]
    });

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

    if (!req.params.query) {
      const modules = await Module.findAll({
        order: [['code', 'ASC']],
        where: {
          universityId: nus!.id
        },
        attributes: ['code']
      });

      res.status(200).json(modules);
      return;
    }

    const modules = await Module.findAll({
      where: {
        code: {
          [Op.iLike]: `${req.params.query.trim()}%`
        },
        universityId: nus!.id
      },
      attributes: ['code'],
      order: [['code', 'ASC']]
    });

    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

export const searchFuncs = [searchUniversities];
export const searchFacultiesFuncs = [searchFaculties];
export const searchModuleNameFuncs = [searchModuleNames];
export const searchModuleCodeFuncs = [searchModuleCode];
