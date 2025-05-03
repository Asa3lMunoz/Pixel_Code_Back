import {
    listDocuments,
    createDocument as createDocumentService,
    listDocumentById,
    deleteDocumentById as deleteDocumentByIdService,
    refactorHtmlAndDownloadPdf as refactorService,
} from "../services/documentsService";
import {Document} from "../types/document";
import {generateDoc} from "../types/generateDoc";

export const getDocuments = async () => {
    return await listDocuments();
}

export const getDocumentById = async (id: string) => {
    return await listDocumentById(id);
}

export const deleteDocumentById = async (id: string) => {
    return await deleteDocumentByIdService(id);
}

export const createDocument = async (body: Document) => {
    return await createDocumentService(body);
}

export const refactorHtmlAndDownloadPdf = async (body: generateDoc) => {
    return await refactorService(body);
}