import {db} from "../config/firebase";
import {collection, doc, getDocs, getDoc} from "firebase/firestore";

export const listUsers = async () => {
    try {
        const users = await getDocs(collection(db, "users"));
        const data = users.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            success: true,
            data,
            count: data.length
        };
    } catch (error) {
        console.error("Error listing contact requests:", error);
        return {
            success: false,
            error: "Error al listar users",
            details: error instanceof Error ? error.message : String(error)
        };
    }
};

export const getUserById = async (id: string) => {
    try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (!userDoc.exists()) {
            return {
                success: false,
                error: "Usuario no encontrado"
            };
        }

        const data = {
            firstName: userDoc.data().firstName,
            lastName: userDoc.data().lastName,
            roles: userDoc.data().roles,
        };

        return {
            success: true,
            data
        };
    } catch (error) {
        console.error("Error obteniendo usuario por ID:", error);
        return {
            success: false,
            error: "Error al obtener usuario",
            details: error instanceof Error ? error.message : String(error)
        };
    }
};