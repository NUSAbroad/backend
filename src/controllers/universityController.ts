import { Request, Response, NextFunction } from 'express';
import { University } from '../models';
import { NotFound } from 'http-errors';
import { formatUniversities } from '../utils/universities';

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

export const indexUniversityFuncs = [indexUniversity];
export const showUniversityFuncs = [retrieveUniversity, showUniversity];
export const createUniversityFuncs = [createUniversity];
export const updateUniversityFuncs = [retrieveUniversity, updateUniversity];
export const destroyUniversityFuncs = [retrieveUniversity, destroyUniversity];
