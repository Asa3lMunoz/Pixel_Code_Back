import { listContactRequests } from "../services/contactRequestService";

export const getContactRequests = async () => {
    return await listContactRequests();
}