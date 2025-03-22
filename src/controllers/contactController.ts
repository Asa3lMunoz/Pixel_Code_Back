import { Contact } from "../types/contact";
import { db } from "../config/firebase";
import { listContacts } from "../services/contactService";

export const registerContact = async (contact: Contact) => {
    try {
        const docRef = await db.collection('contacts').add({
            nombres: contact.nombres,
            apellidos: contact.apellidos,
            email: contact.email,
            telefono: contact.telefono,
            mensaje: contact.mensaje,
            createdAt: new Date()
        });

        return {
            success: true,
            id: docRef.id,
            msg: "Contacto registrado correctamente: " + contact.nombres + " " + contact.apellidos
        };
    } catch (error) {
        console.error("Error adding contact: ", error);
        return {
            success: false,
            error: "Error al registrar el contacto",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}

export const getContacts = async () => {
    return await listContacts();
}