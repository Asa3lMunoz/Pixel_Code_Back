import { Client } from "../types/client";
import { collection, getDocs } from "firebase/firestore";
import { db, db2 } from "../config/firebase";

export const listContactRequests = async () => {
    try {
        const contactRequestSnapshot = await getDocs(collection(db, "contactRequests"));
        const data = contactRequestSnapshot.docs.map(doc => ({
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
            error: "Error al listar contactRequests",
            details: error instanceof Error ? error.message : String(error)
        };
    }
};

export const createContactRequest = async (contactRequest: Client) => {
    try {
        let listaCamposFaltantes = [];

        if (!contactRequest.nombres) {
            listaCamposFaltantes.push('nombres');
        } else if (!contactRequest.apellidos) {
            listaCamposFaltantes.push('apellidos');
        } else if (!contactRequest.email) {
            listaCamposFaltantes.push('email');
        } else if (!contactRequest.telefono) {
            listaCamposFaltantes.push('telefono');
        } else if (!contactRequest.mensaje) {
            listaCamposFaltantes.push('mensaje');
        }

        if (listaCamposFaltantes.length > 0) {
            return {
                success: false,
                error: `Verifique los siguientes campos: ${listaCamposFaltantes.join(', ')}`,
            };
        }

        // Se incorporan los campos 'reviewed' y 'answered' al objeto contactRequest
        const contactRequestWithStatus = {
            firstName: contactRequest.nombres,
            lastName: contactRequest.apellidos,
            email: contactRequest.email,
            phone: contactRequest.telefono,
            message: contactRequest.mensaje,
            reviewed: false,
            answered: false,
            receivedAt: new Date(),
        };

        const docRef = await db2.collection('contactRequests');
        const doc = await docRef.add(contactRequestWithStatus);

        return {
            success: true,
            message: "Solicitud de contacto creada exitosamente con ID: " + doc.id,
        };
    } catch (error) {
        console.error("Error creando solicitud de contacto:", error);
        return {
            success: false,
            error: "Error al crear solicitud de contacto",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}