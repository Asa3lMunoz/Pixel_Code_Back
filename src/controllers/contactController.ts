import { Contact } from "../types/contact";

export const registerContact = (contact: Contact) => {
    return {
        success: true,
        msg: "Contacto registrado correctamente: " + contact.nombres + " " + contact.apellidos
    }
}