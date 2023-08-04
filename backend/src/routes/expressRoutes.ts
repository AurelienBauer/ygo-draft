import { Router } from "express";
import { DataSource } from "../data/interfaces";
import CubeRoutes from "./cubeExpressRoutes";
import CardRoutes from "./cardExpressRoutes";

export default function routes(ds: DataSource): Router {
  const r = Router();

  r.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
  });

  r.use("/v1/cubes", CubeRoutes(ds));
  r.use("/v1/card", CardRoutes(ds));
  return r;
}
