import slug from 'slug';

import { Request, Response, NextFunction } from 'express';
import { Country, University } from '../models';
import { BadRequest, NotFound } from 'http-errors';
import {
  UniversityRow,
  formatUniversities,
  addSlugToUniversityRow,
  addCountryIds,
  cleanUniversityRow
} from '../utils/universities';
import { parse } from 'fast-csv';
import { UniversityCreationAttributes } from '../models/University';
import { csvUpload, UPLOAD_CSV_FORM_FIELD } from '../consts/upload';
import { Op, Transaction } from 'sequelize';
import { NUS } from '../consts';
import sequelize from '../database';
import { CountryCreationAttributes } from '../models/Country';

function getAllUniversityInclude() {
  return [
    {
      association: University.associations.Country,
      attributes: ['name']
    },
    {
      association: University.associations.Links,
      attributes: ['name', 'link']
    },
    {
      association: University.associations.Semesters,
      attributes: ['description']
    }
  ];
}

async function retrieveUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    const university = await University.findOne({
      where: {
        slug: req.params.slug
      },
      include: [
        {
          association: University.associations.Mappings
        },
        {
          association: University.associations.Country,
          attributes: ['name']
        },
        {
          association: University.associations.Links,
          attributes: ['name', 'link']
        },
        {
          association: University.associations.Semesters,
          attributes: ['description']
        }
      ]
    });
    if (!university) throw new NotFound('No university with this slug!');

    req.university = university;
    next();
  } catch (err) {
    next(err);
  }
}

async function indexUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    const universities = await University.findAll({
      order: [['id', 'ASC']],
      include: getAllUniversityInclude()
    });

    const result = await formatUniversities(universities);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function showUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(req.university);
  } catch (err) {
    next(err);
  }
}

async function createUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    const slugName = slug(req.body.name);
    req.body.slug = slugName;

    const university = await University.create(req.body);
    res.status(201).json(university);
  } catch (err) {
    next(err);
  }
}

async function importUniversity(req: Request, res: Response, next: NextFunction) {
  const t: Transaction = await sequelize.transaction();

  try {
    if (!req.file) throw new BadRequest('No file was sent over!');

    const csvString = req.file!.buffer.toString('utf-8').trim();
    const results: UniversityRow[] = [];
    const countryNames = new Set<String>();

    let currRow = 2;
    let parseError = '';

    await new Promise((resolve, _reject) => {
      const stream = parse({ headers: true })
        .on('error', err => {
          const errMsg = `Row ${currRow}: ${err.message}`;
          console.error(errMsg);
          parseError = errMsg;
          currRow += 1;
        })
        .on('data', (row: UniversityRow) => {
          const cleanedRow = cleanUniversityRow(row);
          const newRow = addSlugToUniversityRow(cleanedRow);
          countryNames.add(newRow.country);
          results.push(newRow);
          currRow += 1;
        })
        .on('end', (rowCount: number) => resolve(rowCount));
      stream.write(csvString);
      stream.end();
    });

    if (parseError) throw new BadRequest('Error occured when parsing csv file!');

    const countries = [...countryNames.values()];
    const countriesObj = countries.map((name: String) => {
      return {
        name
      };
    }) as CountryCreationAttributes[];

    await Country.bulkCreate(countriesObj, {
      transaction: t,
      ignoreDuplicates: true
    });

    const universitiesAttributes: UniversityCreationAttributes[] = await addCountryIds(results, t);

    const universities = await University.bulkCreate(universitiesAttributes, {
      transaction: t,
      ignoreDuplicates: true
    });

    await t.commit();

    res.status(201).json(universities);
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function updateUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    const slugName = slug(req.body.name);

    if (slugName !== req.university!.slug) {
      req.university!.slug = slugName;
    }

    const university = await req.university!.update(req.body);
    res.status(200).json(university);
  } catch (err) {
    next(err);
  }
}

async function destroyUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    await req.university!.destroy();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

async function resetUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    const universities = await University.findAll({
      where: {
        name: {
          [Op.ne]: NUS
        }
      },
      attributes: ['id']
    });

    await Promise.all(
      universities.map(async university => {
        await university.destroy();
      })
    );

    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

export const indexUniversityFuncs = [indexUniversity];
export const showUniversityFuncs = [retrieveUniversity, showUniversity];
export const createUniversityFuncs = [createUniversity];
export const updateUniversityFuncs = [retrieveUniversity, updateUniversity];
export const destroyUniversityFuncs = [retrieveUniversity, destroyUniversity];
export const importUniversityFuncs = [csvUpload.single(UPLOAD_CSV_FORM_FIELD), importUniversity];
export const resetUniversityFuncs = [resetUniversity];
export { getAllUniversityInclude };
