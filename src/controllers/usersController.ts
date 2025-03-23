import {listUsers} from "../services/usersService";

export const getUsers = async () => {
    return await listUsers();
}