import {db} from "../config/firebase";
import {collection, getDocs} from "firebase/firestore";
import {getUserById} from "./usersService";

export const listDocuments = async () => {
    try {
        const documentsSnapshot = await getDocs(collection(db, "documents"));
        const data = await Promise.all(documentsSnapshot.docs.map(async (doc) => ({
            id: doc.id,
            createdByData: await getUserById(doc.data().createdBy),
            ...doc.data()
        })));
        return {
            success: true,
            data,
            count: data.length
        };
    } catch (error) {
        console.error("Error listing contact requests:", error);
        return {
            success: false,
            error: "Error al listar documents",
            details: error instanceof Error ? error.message : String(error)
        };
    }
};

