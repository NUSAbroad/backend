import { Request, Response, NextFunction } from 'express';
import { Semester } from '../models';
import { NotFound } from 'http-errors';

async function retrieveSemester(req: Request, res: Response, next: NextFunction) {
  try {
    const semester = await Semester.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!semester) throw new NotFound('No semester with this id!');

    req.semester = semester;
    next();
  } catch (err) {
    next(err);
  }
}

async function indexSemester(req: Request, res: Response, next: NextFunction) {
  try {
    const semesters = await Semester.findAll({
      order: [['id', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.status(200).json(semesters);
  } catch (err) {
    next(err);
  }
}

async function showSemester(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(req.semester);
  } catch (err) {
    next(err);
  }
}

async function createSemester(req: Request, res: Response, next: NextFunction) {
  try {
    const semester = await Semester.create(req.body);
    res.status(201).json(semester);
  } catch (err) {
    next(err);
  }
}

async function updateSemester(req: Request, res: Response, next: NextFunction) {
  try {
    const semester = await req.semester!.update(req.body);
    res.status(200).json(semester);
  } catch (err) {
    next(err);
  }
}

async function destroySemester(req: Request, res: Response, next: NextFunction) {
  try {
    await req.semester!.destroy();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

export const indexSemesterFuncs = [indexSemester];
export const showSemesterFuncs = [retrieveSemester, showSemester];
export const createSemesterFuncs = [createSemester];
export const updateSemesterFuncs = [retrieveSemester, updateSemester];
export const destroySemesterFuncs = [retrieveSemester, destroySemester];
