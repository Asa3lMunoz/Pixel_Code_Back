import {
    listDocuments,
    createDocument as createDocumentService,
    listDocumentById
} from "../services/documentsService";
import {Document} from "../types/document";

export const getDocuments = async () => {
    return await listDocuments();
}

export const getDocumentById = async (id: string) => {
    return await listDocumentById(id);
}

export const createDocument = async (body: Document) => {
    return await createDocumentService(body);
}