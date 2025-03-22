import { Elysia } from "elysia";
import { getContactRequests } from "../controllers/contactRequestsController";

export const contactRequestsRoutes = new Elysia({ prefix: "/contactRequests" })
  .get("/", async () => {
    return await getContactRequests();
  });