import { Request, Response, NextFunction } from 'express';
import { Link } from '../models';
import { NotFound } from 'http-errors';
import { scrapeData } from '../utils/links';
import { LinkCreationAttributes } from '../models/Link';

async function retrieveLink(req: Request, res: Response, next: NextFunction) {
  try {
    const link = await Link.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!link) throw new NotFound('No link with this id!');

    req.link = link;
    next();
  } catch (err) {
    next(err);
  }
}

async function indexLink(req: Request, res: Response, next: NextFunction) {
  try {
    const links = await Link.findAll({
      order: [['id', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.status(200).json(links);
  } catch (err) {
    next(err);
  }
}

async function showLink(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(req.link);
  } catch (err) {
    next(err);
  }
}

async function createLink(req: Request, res: Response, next: NextFunction) {
  try {
    const link = await Link.create(req.body);
    res.status(201).json(link);
  } catch (err) {
    next(err);
  }
}

async function updateLink(req: Request, res: Response, next: NextFunction) {
  try {
    const link = await req.link!.update(req.body);
    res.status(200).json(link);
  } catch (err) {
    next(err);
  }
}

async function destroyLink(req: Request, res: Response, next: NextFunction) {
  try {
    await req.link!.destroy();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

async function resetLinks(req: Request, res: Response, next: NextFunction) {
  try {
    await Link.destroy({
      where: {}
    });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
}

async function scrapePDFLinks(req: Request, res: Response, next: NextFunction) {
  try {
    const linkCreationAttributes: LinkCreationAttributes[] = await scrapeData();
    const links = await Link.bulkCreate(linkCreationAttributes, {
      ignoreDuplicates: true
    });

    res.status(200).json(links);
  } catch (err) {
    next(err);
  }
}

export const indexLinkFuncs = [indexLink];
export const showLinkFuncs = [retrieveLink, showLink];
export const createLinkFuncs = [createLink];
export const updateLinkFuncs = [retrieveLink, updateLink];
export const destroyLinkFuncs = [retrieveLink, destroyLink];
export const resetLinksFuncs = [resetLinks];
export const scrapeGROLinksFuncs = [scrapePDFLinks];
