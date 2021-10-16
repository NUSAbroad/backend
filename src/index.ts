import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ValidationError } from 'sequelize';

import { PORT } from './consts';
import { handleError } from './errors/utils';
import { NotFound, HttpError } from 'http-errors';

import Logger from './logger/logger';

import universities from './routes/universities';
import mappings from './routes/mappings';
import modules from './routes/modules';
import search from './routes/search';
import countries from './routes/countries';
import links from './routes/links';
import semesters from './routes/semesters';
import morganMiddleware from './middleware/morganMiddleware';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

app.get('/', async (req: Request, res: Response) => {
  Logger.error('This is an error log');
  Logger.warn('This is a warn log');
  Logger.info('This is a info log');
  Logger.http('This is a http log');
  Logger.debug('This is a debug log');
  res.send('Hello World!');
});

app.use('/universities', universities);
app.use('/mappings', mappings);
app.use('/modules', modules);
app.use('/search', search);
app.use('/countries', countries);
app.use('/links', links);
app.use('/semesters', semesters);

// Handle all resource not found
app.all('*', (req: Request, res: Response) => {
  const err = new NotFound('Unable to find the resource you are looking for');
  res.status(404).json(err);
});

// Catch all HTTP errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json(handleError(err));
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json(handleError(err));
    return;
  }

  next(err);
});

// Catch all other non-HTTP errors
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json(handleError(err));
});

app.listen(PORT, () => {
  console.log(`Express server is listening on ${PORT}`);
});

export default app;
