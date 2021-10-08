import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { PORT } from './consts';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello World!!!');
});

app.listen(PORT, () => {
  console.log(`Express server is listening on ${PORT}`);
});

export default app;
