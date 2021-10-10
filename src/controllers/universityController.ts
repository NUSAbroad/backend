import { Request, Response, NextFunction } from 'express';
import { University } from '../models';
import { BadRequest, NotFound } from 'http-errors';
import { formatUniversities } from '../utils/universities';
import multer from 'multer';
import { parse } from 'fast-csv';
import { UniversityCreationAttributes } from '../models/University';

const UPLOAD_CSV_FORM_FIELD = 'file';
const MAX_CSV_SIZE = 10 * 1024 * 1024;

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_CSV_SIZE }
});

interface UniversityRow {
  name: string;
  country: string;
  state?: string;
}

async function retrieveUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    const university = await University.findByPk(req.params.id, {
      include: [
        {
          association: University.associations.Mappings,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ]
    });
    if (university === null) {
      throw new NotFound('No university with this id!');
    }
    req.university = university;
    next();
  } catch (err) {
    next(err);
  }
}

async function indexUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    const universities = await University.findAll({
      order: [['id', 'ASC']]
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
    const university = await University.create(req.body);
    res.status(201).json(university);
  } catch (err) {
    next(err);
  }
}

async function importUniversity(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new BadRequest('No file was sent over!');

    const csvString = req.file!.buffer.toString('utf-8').trim();
    const results: UniversityCreationAttributes[] = [];
    let currRow = 2;
    let parseError = '';

    await new Promise((resolve, _reject) => {
      const stream = parse({ headers: true })
        .on('data', (row: UniversityRow) => {
          results.push(row as UniversityCreationAttributes);
          currRow += 1;
        })
        .on('error', err => {
          // Stream will automatically exit once a parsing error is detected.
          const errMsg = `Row ${currRow}: ${err.message}`;
          console.error(errMsg);
          parseError = errMsg;
          currRow += 1;
        })
        .on('end', (rowCount: number) => resolve(rowCount));
      stream.write(csvString);
      stream.end();
    });

    if (parseError) throw new BadRequest('Error occured when parsing csv file!');

    const universities = await University.bulkCreate(results);

    res.status(201).json(universities);
  } catch (err) {
    next(err);
  }
}

async function updateUniversity(req: Request, res: Response, next: NextFunction) {
  try {
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
    await University.destroy({
      where: {}
    });
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
