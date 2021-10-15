import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import University from '../models/University';
import { NUS } from '../consts';
import { cleanInput } from '../utils/search';
import { formatUniversities } from '../utils/universities';

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
      )) AND name != '${NUS}'`;

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
      include: [
        {
          association: University.associations.Country,
          attributes: ['name']
        },
        {
          association: University.associations.Links,
          attributes: ['name', 'link']
        }
      ]
    });

    const result = await formatUniversities(searchResult);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export const searchFuncs = [searchUniversities];
