import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { DataSource } from "../data/interfaces";
import Cubes from "../domain/useCases/Cubes";
import logger from "../logger";

const validLanguage = ["en", "fr"];

export default function CubeRoutes(ds: DataSource) {
  const routes = Router();
  const cube = new Cubes(ds);

  routes.get("/", async (req: Request, res: Response) => {
    try {
      const cubes = await cube.getAll();
      logger.info(cubes);
      res.send(cubes);
    } catch (err) {
      res.status(500).send({ message: "Error fetching data" });
    }
  });

  routes.get("/:id", async (req: Request, res: Response) => {
    try {
      const language = req.query.language as string;
      if (language && !validLanguage.includes(language)) {
        return res.status(400).send({ message: "Language set is invalid" });
      }
      const c = await cube.getByID(req.params.id, language);
      res.send(c);
    } catch (err) {
      res.status(500).send({ message: "Error fetching data" });
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
    }
  );

  // routes.post("/load-cube-form-file", async (req: Request, res: Response) => {
  //   try {
  //     const { name, content } = req.body;

  //     const cards = await _getCardAsync(content);
  //     const newCube = new Cubes({
  //       name,
  //       cardsId: cards,
  //     });
  //     await newCube.save();

  //     res.status(httpStatus.CREATED).json({
  //       id: newCube._id,
  //     });
  //   } catch (err) {
  //     if (err && err.error && err.error === "CARD_NOT_FOUND") {
  //       res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
  //     }
  //   }
  // });

  return routes;
}
