import { listContactRequests } from "../services/contactRequestService";
import {Client} from "../types/client";

export const getContactRequests = async () => {
    return await listContactRequests();
}

export const createContactRequest = async (contactRequest: Client): Promise<any> => {
    return await createContactRequest(contactRequest);
}