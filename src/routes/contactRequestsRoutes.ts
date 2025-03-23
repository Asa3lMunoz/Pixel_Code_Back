import { Elysia } from "elysia";
import { getContactRequests } from "../controllers/contactRequestsController";
import { createContactRequest } from "../services/contactRequestService";
import { Client } from "../types/client";

export const contactRequestsRoutes = new Elysia({prefix: "/contactRequests"})
  .get("/", async () => {
      return await getContactRequests();
  })
  .post("/", async (req: any) => {
      const contactRequest: Client = req.body;
      return await createContactRequest(contactRequest);
  });