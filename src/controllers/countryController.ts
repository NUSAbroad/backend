import { Request, Response, NextFunction } from 'express';
import { Country } from '../models';
import { NotFound } from 'http-errors';

async function retrieveCountry(req: Request, res: Response, next: NextFunction) {
  try {
    const country = await Country.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (country === null) {
      throw new NotFound('No country with this id!');
    }

    req.country = country;
    next();
  } catch (err) {
    next(err);
  }
}

async function indexCountry(req: Request, res: Response, next: NextFunction) {
  try {
    const countries = await Country.findAll({
      order: [['name', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.status(200).json(countries);
  } catch (err) {
    next(err);
  }
}

async function showCountry(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(req.country);
  } catch (err) {
    next(err);
  }
}

async function createCountry(req: Request, res: Response, next: NextFunction) {
  try {
    const country = await Country.create(req.body);
    res.status(201).json(country);
  } catch (err) {
    next(err);
  }
}

async function updateCountry(req: Request, res: Response, next: NextFunction) {
  try {
    const country = await req.country!.update(req.body);
    res.status(200).json(country);
  } catch (err) {
    next(err);
  }
}

async function destroyCountry(req: Request, res: Response, next: NextFunction) {
  try {
    await req.country!.destroy();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

export const indexCountryFuncs = [indexCountry];
export const showCountryFuncs = [retrieveCountry, showCountry];
export const createCountryFuncs = [createCountry];
export const updateCountryFuncs = [retrieveCountry, updateCountry];
export const destroyCountryFuncs = [retrieveCountry, destroyCountry];
