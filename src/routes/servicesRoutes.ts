import { Elysia } from "elysia";
import {getServices} from "../controllers/servicesController";

export const servicesRoutes = new Elysia({ prefix: "/services" })
  .get("/", async () => {
    return await getServices();
  });