import { listDocuments, createDocument as createDocumentService } from "../services/documentsService";
import {Document} from "../types/document";

export const getDocuments = async () => {
    return await listDocuments();
}

export const createDocument = async (body: Document) => {
    return await createDocumentService(body);
}