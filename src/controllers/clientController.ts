import { Client } from "../types/client";
import { registerClient, listClients } from "../services/clientService";

export const setClient = async (contact: Client) => {
    return await registerClient(contact);
}
export const getClients = async () => {
    return await listClients();
}