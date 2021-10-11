import { Request, Response, NextFunction } from 'express';
import { Mapping } from '../models';
import { NotFound } from 'http-errors';

async function retrieveMapping(req: Request, res: Response, next: NextFunction) {
  try {
    const mapping = await Mapping.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (mapping === null) {
      throw new NotFound('No mapping with this id!');
    }
    req.mapping = mapping;
    next();
  } catch (err) {
    next(err);
  }
}

async function indexMapping(req: Request, res: Response, next: NextFunction) {
  try {
    const mappings = await Mapping.findAll({
      order: [['id', 'ASC']]
    });

    res.status(200).json(mappings);
  } catch (err) {
    next(err);
  }
}

async function showMapping(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(req.mapping);
  } catch (err) {
    next(err);
  }
}

async function createMapping(req: Request, res: Response, next: NextFunction) {
  try {
    const mapping = await Mapping.create(req.body);
    res.status(201).json(mapping);
  } catch (err) {
    next(err);
  }
}

async function updateMapping(req: Request, res: Response, next: NextFunction) {
  try {
    const mapping = await req.mapping!.update(req.body);
    res.status(200).json(mapping);
  } catch (err) {
    next(err);
  }
}

async function destroyMapping(req: Request, res: Response, next: NextFunction) {
  try {
    await req.mapping!.destroy();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

export const indexMappingFuncs = [indexMapping];
export const showMappingFuncs = [retrieveMapping, showMapping];
export const createMappingFuncs = [createMapping];
export const updateMappingFuncs = [retrieveMapping, updateMapping];
export const destroyMappingFuncs = [retrieveMapping, destroyMapping];
