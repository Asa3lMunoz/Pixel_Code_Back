import { Elysia } from "elysia";
import { registerContact, getContacts } from "../controllers/contactController";
import { Contact } from "../types/contact";

export const contactRoutes = new Elysia({ prefix: "/clients" })
  .post("/", async ({ body }) => {
    return await registerContact(body as Contact);
  })
  .get("/", async () => {
    return await getContacts();
  });