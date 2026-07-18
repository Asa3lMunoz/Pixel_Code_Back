import {Elysia, t} from "elysia";
import {
    getDocuments,
    createDocument,
    getDocumentById,
    deleteDocumentById,
    refactorHtmlAndDownloadPdf
} from "../controllers/documentsController";
import {generateDoc} from "../types/generateDoc";
import {Document} from "../types/document";

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
    .post("/", async ({ body }) => {
        return await createDocument(body as Document);
    }, {
        body: t.Object({
            bannerImg: t.Optional(t.File()),
            xlsxFile:  t.Optional(t.File()),
        }, { additionalProperties: true })
    })
    .post("/get-certificado", async ({ body }: { body: generateDoc }) => {
        return await refactorHtmlAndDownloadPdf(body);
    })
;