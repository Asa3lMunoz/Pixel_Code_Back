import { loginUser as loginUserService } from "../services/authService";
import {UserData} from "../types/auth";

export const loginUser = async (login: UserData): Promise<any> => {
    return loginUserService(login);
}
