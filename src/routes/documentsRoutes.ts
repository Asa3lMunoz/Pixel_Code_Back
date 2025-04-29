import {Elysia} from "elysia";
import {getDocuments, createDocument, getDocumentById, deleteDocumentById} from "../controllers/documentsController";

export const documentsRoutes = new Elysia({prefix: "/documents"})
    .get("/", async () => {
        return await getDocuments();
    })
    .get("/:id", async ({params}) => {
        const {id} = params;
        return await getDocumentById(id);
    })
    .delete("/:id", async ({params}) => {
        const {id} = params;
        return await deleteDocumentById(id);
    })
    .post("/", async ({ body }: { body: Document }) => {
        return await createDocument(body);
    });