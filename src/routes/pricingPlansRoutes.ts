import { Elysia } from "elysia";
import {getPricingPlans} from "../controllers/pricingPlansController";

export const pricingPlansRoutes = new Elysia({ prefix: "/pricingPlans" })
  .get("/", async () => {
    return await getPricingPlans();
  });