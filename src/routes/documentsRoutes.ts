import {Elysia} from "elysia";
import {
    getDocuments,
    createDocument,
    getDocumentById,
    deleteDocumentById,
    refactorHtmlAndDownloadPdf
} from "../controllers/documentsController";
import {generateDoc} from "../types/generateDoc";

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
    })
    .post("/get-certificado", async ({ body }: { body: generateDoc }) => {
        return await refactorHtmlAndDownloadPdf(body);
    })
;