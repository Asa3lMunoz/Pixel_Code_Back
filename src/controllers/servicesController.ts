import {listServices} from "../services/servicesService";

export const getServices = async () => {
    return await listServices();
}