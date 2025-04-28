import {Elysia} from "elysia";
import {getDocuments, createDocument} from "../controllers/documentsController";

export const documentsRoutes = new Elysia({prefix: "/documents"})
    .get("/", async () => {
        return await getDocuments();
    })
    .post("/", async ({ body }) => {
        return await createDocument(body);
    });