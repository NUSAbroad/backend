import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ValidationError } from 'sequelize';

import { PORT, NODE_ENV } from './consts';
import { handleError } from './errors/utils';
import { NotFound, HttpError } from 'http-errors';
import morganMiddleware from './middleware/morganMiddleware';
import swaggerUi, { SwaggerUiOptions } from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

import universities from './routes/universities';
import mappings from './routes/mappings';
import modules from './routes/modules';
import search from './routes/search';
import countries from './routes/countries';
import links from './routes/links';
import semesters from './routes/semesters';
import faculties from './routes/faculties';
import users from './routes/users';

const app = express();

const swaggerPath = NODE_ENV === 'development' ? '../docs/swagger.yaml' : '../../docs/swagger.yaml';
const swaggerDocument = yaml.load(
  fs.readFileSync(path.resolve(__dirname, swaggerPath), 'utf8')
) as JSON;

const swaggerOptions = {
  swaggerOptions: {
    // Turn off syntax highlight as large response payloads hang swagger ui
    syntaxHighlight: {
      activated: false
    }
  }
} as SwaggerUiOptions;

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/universities', universities);
app.use('/mappings', mappings);
app.use('/modules', modules);
app.use('/search', search);
app.use('/countries', countries);
app.use('/links', links);
app.use('/semesters', semesters);
app.use('/faculties', faculties);
app.use('/', users);

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

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
