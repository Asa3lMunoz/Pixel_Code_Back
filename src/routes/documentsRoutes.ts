import { Elysia } from "elysia";
import {getDocuments} from "../controllers/documentsController";

export const documentsRoutes = new Elysia({ prefix: "/documents" })
  .get("/", async () => {
    return await getDocuments();
  });