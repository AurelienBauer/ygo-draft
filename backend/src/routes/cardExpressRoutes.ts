import { Request, Response, Router } from "express";
import { DataSource } from "../data/interfaces";
import Card from "../domain/useCases/Card";

export default function CardRoutes(ds: DataSource) {
  const routes = Router();
  const card = new Card(ds);

  routes.get("/:id", async (req: Request, res: Response) => {
    try {
      res.send(await card.getByID(req.params.id));
    } catch (err) {
      res.status(500).send({ message: "Error fetching data" });
    }
  });

  return routes;
}
