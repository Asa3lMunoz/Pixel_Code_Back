import { Elysia } from "elysia";
import { setClient, getClients } from "../controllers/clientController";
import { Client } from "../types/client";

export const clientRoutes = new Elysia({ prefix: "/clients" })
  .post("/", async ({ body }) => {
    return await setClient(body as Client);
  })
  .get("/", async () => {
    return await getClients();
  });