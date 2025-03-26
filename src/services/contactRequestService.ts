import {db} from "../config/firebase";
import {Client} from "../types/client";
import admin from "firebase-admin";

export const listContactRequests = async () => {
    try {
        const contactRequestSnapshot = await db.collection('contactRequests').get();
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
        let campoFaltante = '';

        if (!contactRequest.nombres) {
            campoFaltante = 'nombres';
        } else if (!contactRequest.apellidos) {
            campoFaltante = 'apellidos';
        } else if (!contactRequest.email) {
            campoFaltante = 'email';
        } else if (!contactRequest.telefono) {
            campoFaltante = 'telefono';
        }

        if (campoFaltante) {
            return {
                success: false,
                error: `El campo ${campoFaltante} es requerido`
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
            receivedAt: admin.firestore.Timestamp.fromDate(new Date())
        };

        await db.collection('contactRequests').add(contactRequestWithStatus);

        return {
            success: true,
            message: "Solicitud de contacto creada exitosamente"
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