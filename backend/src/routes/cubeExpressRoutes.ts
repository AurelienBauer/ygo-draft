import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { DataSource } from "../data/interfaces";
import Cubes from "../domain/useCases/Cubes";
import logger from "../logger";

const validLanguage = ["en", "fr"];

export default function CubeRoutes(ds: DataSource) {
  const routes = Router();
  const cube = new Cubes(ds);

  routes.get("/", async (_req: Request, res: Response) => {
    try {
      const cubes = await cube.getAll();
      logger.info(cubes);
      return res.send(cubes);
    } catch (err) {
      return res.status(500).send({ message: "Error fetching data" });
    }
  });

  routes.get("/:id", async (req: Request, res: Response) => {
    try {
      const language = req.query.language as string;
      if (language && !validLanguage.includes(language)) {
        return res.status(400).send({ message: "Language set is invalid" });
      }
      const c = await cube.getByID(req.params.id, language);
      return res.send(c);
    } catch (err) {
      return res.status(500).send({ message: "Error fetching data" });
    }
  });

  routes.post(
    "/",
    body("name").isString().isLength({ min: 2 }),
    body("description").isString().isLength({ min: 2 }),
    body("data").isArray(),
    async (req: Request, res: Response) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        }
        const c = await cube.save(req.body);
        res.send({ id: c });
      } catch (err) {
        res.status(500).send({ message: "Error fetching data" });
      }
    },
  );

  return routes;
}
