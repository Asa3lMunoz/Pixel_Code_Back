import {Elysia} from "elysia";
import {getDocuments, createDocument, getDocumentById} from "../controllers/documentsController";

export const documentsRoutes = new Elysia({prefix: "/documents"})
    .get("/", async () => {
        return await getDocuments();
    })
    .get("/:id", async ({params}) => {
        const {id} = params;
        return await getDocumentById(id);
    })
    .post("/", async ({ body }: { body: Document }) => {
        return await createDocument(body);
    });