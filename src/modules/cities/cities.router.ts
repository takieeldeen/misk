import { Router } from "express";
import { getAllCitiesHandler } from "./cities.controller.js";

const CitiesRouter = Router();

CitiesRouter.route("/").get(getAllCitiesHandler);

export default CitiesRouter;
