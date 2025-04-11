import { loginUser as loginUserService, signUpUser as signUpUserService } from "../services/authService";
import {UserData} from "../types/auth";

export const loginUser = async (login: UserData): Promise<any> => {
    return loginUserService(login);
}

export const signUpUser = async (user: UserData): Promise<any> => {
    return signUpUserService(user);
}
