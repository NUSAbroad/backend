import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import University from '../models/University';
import { NUS } from '../consts';

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
    }

    const query = cleanInput(req.params.query);
    console.log(query);
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
        )
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

/**
 * Removes boolean operators from user query for to_tsquery.
 * @param input User query.
 */
function cleanInput(input: String) {
  return input.replace(/[|&!<>]+/g, '').replace(/ /g, '');
}

export const searchFuncs = [searchUniversities];
