import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { PORT } from "./consts";
import { University } from "./models";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  const universities = await University.findAll({
    order: [["id", "ASC"]],
    include: [
      {
        association: University.associations.Modules,
      },
    ],
  });

  res.status(200).json(universities);
});

app.listen(PORT, () => {
  console.log(`Express server is listening on ${PORT}`);
});

export default app;
