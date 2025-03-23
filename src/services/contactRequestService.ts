import {db} from "../config/firebase";
import {Client} from "../types/client";

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
            data: {
                firstName: contactRequest.nombres,
                lastName: contactRequest.apellidos,
                email: contactRequest.email,
                phone: contactRequest.telefono,
                message: contactRequest.mensaje,
                reviewed: false,
                answered: false,
                receivedAt: {
                    _seconds: Math.floor(Date.now() / 1000),
                    _nanoseconds: (Date.now() % 1000) * 1000000
                }
            }
        };

        await db.collection('contactRequests').add(contactRequestWithStatus);

        return {
            success: true,
            message: "Contact request created successfully"
        };
    } catch (error) {
        console.error("Error creating contact request:", error);
        return {
            success: false,
            error: "Error al crear contactRequest",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}