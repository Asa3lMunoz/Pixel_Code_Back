import { UserData } from "../types/auth";
import { auth } from "../config/firebase";
import { AuthResponse } from "../types/user";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {getUserByEmail, getUserById} from "./usersService";

export const loginUser = async (login: UserData): Promise<AuthResponse> => {
    try {
        if (!login.email || !login.password) {
            return {
                success: false,
                error: "Email y contraseña son requeridos."
            };
        }

        // Autenticar usuario con Firebase usando nuevos métodos
        const userCredential = await signInWithEmailAndPassword(auth, login.email, login.password);

        if (!userCredential.user) {
            return {
                success: false,
                error: "Error al autenticar usuario"
            };
        }

        // Obtener datos del usuario del objeto userCredential
        const user = userCredential.user;

        const dataUsuarioEncontradoPorId = await getUserById(user.uid);

        return {
            success: true,
            message: "Se ha iniciado sesión correctamente.",
            user: {
                uid: user.uid,
                email: user.email || '',
                firstName: dataUsuarioEncontradoPorId?.data?.firstName || undefined,
                lastName: dataUsuarioEncontradoPorId?.data?.lastName || undefined,
                roles: dataUsuarioEncontradoPorId?.data?.roles || [],
                phoneNumber: user.phoneNumber || undefined,
                photoURL: user.photoURL || undefined,
                emailVerified: user.emailVerified,
            },
        };
    } catch (error) {
        console.error("Error logging in user:", error);

        // Manejar errores específicos de Firebase Auth
        let errorMessage = "Error al iniciar sesión";
        
        if (error instanceof Error) {
            const errorCode = (error as any).code;
            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                errorMessage = "Email o contraseña incorrectos";
            } else if (errorCode === 'auth/too-many-requests') {
                errorMessage = "Demasiados intentos fallidos. Inténtalo más tarde";
            } else if (errorCode === 'auth/user-disabled') {
                errorMessage = "Esta cuenta ha sido deshabilitada";
            }
        }

        return {
            success: false,
            error: errorMessage,
            details: error instanceof Error ? error.message : String(error)
        };
    }
};

export const signUpUser = async (user: UserData): Promise<AuthResponse> => {
    try {
        if (!user.email || !user.password) {
            return {
                success: false,
                error: "Email y contraseña son requeridos."
            };
        }
        // Validar que la contraseña tenga al menos 6 caracteres
        if (user.password.length < 6) {
            return {
                success: false,
                error: "La contraseña debe tener al menos 6 caracteres."
            };
        }

        // Encontrar usuario existente por email
        const existingUser = await getUserByEmail(user.email);
        if (existingUser.success) {
            return {
                success: false,
                error: "El email ya está registrado."
            };
        }

        // Crear nuevo usuario en Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);

        if (!userCredential.user) {
            return {
                success: false,
                error: "Error al crear el usuario"
            };
        }

        return {
            success: true,
            message: "Usuario creado correctamente."
        };
    } catch (error) {
        console.error("Error signing up user:", error);
        return {
            success: false,
            error: "Error al crear el usuario",
            details: error instanceof Error ? error.message : String(error)
        };
    }
};