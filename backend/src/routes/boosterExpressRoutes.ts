import { Router, Request, Response } from "express";
import { DataSource } from "../data/interfaces";
import Booster from "../domain/useCases/Booster";

export default function BoosterRoutes(ds: DataSource) {
  const routes = Router();
  const booster = new Booster(ds);

  routes.get("/", async (req: Request, res: Response) => {
    try {
      return res.send(await booster.getAll());
    } catch (err) {
      return res.status(500).send({ message: "Error fetching data" });
    }
  });

  routes.get("/:id/card", async (req: Request, res: Response) => {
    try {
      const language = req.query.language as string;
      return res.send(await booster.getCards(req.params.id, language));
    } catch (err) {
      return res.status(500).send({ message: "Error fetching data" });
    }
  });

  return routes;
}
