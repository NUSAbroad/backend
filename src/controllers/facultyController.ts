import { Request, Response, NextFunction } from 'express';
import { Faculty } from '../models';
import { NotFound } from 'http-errors';

async function retrieveFaculty(req: Request, res: Response, next: NextFunction) {
  try {
    const faculty = await Faculty.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (faculty === null) {
      throw new NotFound('No faculty with this id!');
    }

    req.faculty = faculty;
    next();
  } catch (err) {
    next(err);
  }
}

async function indexFaculty(req: Request, res: Response, next: NextFunction) {
  try {
    const countries = await Faculty.findAll({
      order: [['id', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.status(200).json(countries);
  } catch (err) {
    next(err);
  }
}

async function showFaculty(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(req.faculty);
  } catch (err) {
    next(err);
  }
}

async function createFaculty(req: Request, res: Response, next: NextFunction) {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (err) {
    next(err);
  }
}

async function updateFaculty(req: Request, res: Response, next: NextFunction) {
  try {
    const faculty = await req.faculty!.update(req.body);
    res.status(200).json(faculty);
  } catch (err) {
    next(err);
  }
}

async function destroyFaculty(req: Request, res: Response, next: NextFunction) {
  try {
    await req.faculty!.destroy();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

export const indexFacultyFuncs = [indexFaculty];
export const showFacultyFuncs = [retrieveFaculty, showFaculty];
export const createFacultyFuncs = [createFaculty];
export const updateFacultyFuncs = [retrieveFaculty, updateFaculty];
export const destroyFacultyFuncs = [retrieveFaculty, destroyFaculty];
