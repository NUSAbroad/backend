import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import University from '../models/University';
import { NUS } from '../consts';
import { cleanInput } from '../utils/search';

async function searchUniversities(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.params.query) {
      const universities = await University.findAll({
        order: [['id', 'ASC']],
        where: {
          name: {
            [Op.ne]: NUS
          }
        }
      });

      res.status(200).json(universities);
      return;
    }

    const query = cleanInput(req.params.query);
    const universities = await University.sequelize!.query(
      `
        SELECT *
        FROM "Universities"
        WHERE id IN (
          SELECT "partnerUniversityId"
          FROM "Mappings"
          WHERE _search @@ to_tsquery('english', '${query}')
        ) OR id IN (
          SELECT "id"
          FROM "Universities"
          WHERE _search @@ to_tsquery('english', '${query}')
        ) AND name != '${NUS}'
      `,
      {
        model: University,
        replacements: { query: query }
      }
    );
    res.status(200).json(universities);
  } catch (err) {
    next(err);
  }
}

export const searchFuncs = [searchUniversities];
