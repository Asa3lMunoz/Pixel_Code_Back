import { listDocuments } from "../services/documentsService";

export const getDocuments = async () => {
    return await listDocuments();
}