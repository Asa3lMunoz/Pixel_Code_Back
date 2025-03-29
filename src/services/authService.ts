import {UserData} from "../types/auth";

export const loginUser = async (login: UserData) => {
    try {
        if (!login.email || !login.password) {
            return {
                success: false,
                error: "Email y contraseña son requeridos."
            };
        }

        return {
            success: true,
            message: "Se ha iniciado sesión correctamente.",
            data: {
                login: login.email,
                password: login.password
            }
        }
    } catch (error) {
        console.error("Error logging in user:", error);

        return {
            success: false,
            error: "Error al iniciar sesión",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}