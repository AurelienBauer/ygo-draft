import { Request, Response, Router } from "express";
import { DataSource } from "../data/interfaces";
import Booster from "../domain/useCases/Booster";

export default function InternalRoutes(ds: DataSource) {
  const routes = Router();
  const booster = new Booster(ds);

  routes.post("/fetch_boosters", async (req: Request, res: Response) => {
    try {
      return res.send(await booster.fetchBooster());
    } catch (err) {
      return res.status(500).send({ message: "Error fetching data" });
    }
  });

  return routes;
}
