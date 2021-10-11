import { Request, Response, NextFunction } from 'express';
import { Mapping } from '../models';
import { NotFound, BadRequest } from 'http-errors';
import { MappingCreationAttributes } from '../models/Mapping';
import { csvUpload, UPLOAD_CSV_FORM_FIELD } from '../consts/upload';
import { createMappingInfo, generateMappings, MappingInfo, MappingRow } from '../utils/mappings';
import { parse } from 'fast-csv';

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

async function importMapping(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new BadRequest('No file was sent over!');

    const csvString = req.file!.buffer.toString('utf-8').trim();
    const results: MappingInfo[] = [];
    let currRow = 2;
    let parseError = '';

    await new Promise((resolve, _reject) => {
      const stream = parse<MappingRow, MappingCreationAttributes>({ headers: true })
        .transform((data: MappingRow) => {
          const mappingInfo: MappingInfo = createMappingInfo(data);
          return mappingInfo;
        })
        .on('error', err => {
          const errMsg = `Row ${currRow}: ${err.message}`;
          console.error(errMsg);
          parseError = errMsg;
          currRow += 1;
        })
        .on('data', (row: MappingInfo) => {
          results.push(row);
          currRow += 1;
        })
        .on('end', (rowCount: number) => resolve(rowCount));
      stream.write(csvString);
      stream.end();
    });

    if (parseError) throw new BadRequest('Error occured when parsing csv file!');

    const mappingAttributes: MappingCreationAttributes[] = await generateMappings(results);

    const mappings: Mapping[] = await Mapping.bulkCreate(mappingAttributes);
    res.status(201).json(mappings);
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

async function resetMapping(req: Request, res: Response, next: NextFunction) {
  try {
    await Mapping.destroy({
      where: {}
    });
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
export const importMappingFuncs = [csvUpload.single(UPLOAD_CSV_FORM_FIELD), importMapping];
export const resetMappingFuncs = [resetMapping];
