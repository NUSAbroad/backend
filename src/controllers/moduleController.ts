import { Request, Response, NextFunction } from 'express';
import { Module } from '../models';
import { NotFound } from 'http-errors';

async function retrieveModule(req: Request, res: Response, next: NextFunction) {
  try {
    const module = await Module.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (module === null) {
      throw new NotFound('No module with this id!');
    }
    req.module = module;
    next();
  } catch (err) {
    next(err);
  }
}

async function indexModule(req: Request, res: Response, next: NextFunction) {
  try {
    const modules = await Module.findAll({
      order: [['id', 'ASC']]
    });

    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

async function showModule(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(req.module);
  } catch (err) {
    next(err);
  }
}

async function createModule(req: Request, res: Response, next: NextFunction) {
  try {
    const module = await Module.create(req.body);
    res.status(201).json(module);
  } catch (err) {
    next(err);
  }
}

async function updateModule(req: Request, res: Response, next: NextFunction) {
  try {
    const module = await req.module!.update(req.body);
    res.status(200).json(module);
  } catch (err) {
    next(err);
  }
}

async function destroyModule(req: Request, res: Response, next: NextFunction) {
  try {
    await req.module!.destroy();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

export const indexModuleFuncs = [indexModule];
export const showModuleFuncs = [retrieveModule, showModule];
export const createModuleFuncs = [createModule];
export const updateModuleFuncs = [retrieveModule, updateModule];
export const destroyModuleFuncs = [retrieveModule, destroyModule];
