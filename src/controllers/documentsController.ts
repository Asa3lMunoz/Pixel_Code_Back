import {
    listDocuments,
    createDocument as createDocumentService,
    listDocumentById,
    deleteDocumentById as deleteDocumentByIdService
} from "../services/documentsService";

export const getDocuments = async () => {
    return await listDocuments();
}

export const getDocumentById = async (id: string) => {
    return await listDocumentById(id);
}

export const deleteDocumentById = async (id: string) => {
    return await deleteDocumentByIdService(id);
}

export const createDocument = async (body: FormData) => {
    return await createDocumentService(body);
}