import { db } from "../config/firebase";
import {Client} from "../types/client";

export const registerClient = async (client: Client) => {
  try {
    let campoFaltante = '';

    if (!client.nombres) {
      campoFaltante = 'nombres';
    } else if (!client.apellidos) {
      campoFaltante = 'apellidos';
    } else if (!client.email) {
      campoFaltante = 'email';
    } else if (!client.telefono) {
      campoFaltante = 'telefono';
    }

    if (campoFaltante) {
      return {
        success: false,
        error: `El campo ${campoFaltante} es requerido`
      };
    }

    return {
      success: true,
      msg: "Contacto registrado correctamente: " + client.nombres + " " + client.apellidos
    };
  } catch (error) {
    return {
      success: false,
      error: "Error al registrar el cliento",
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

export const listClients = async () => {
  try {
    const clientsSnapshot = await db.collection('clients').get();
    const clients = clientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      clients,
      count: clients.length
    };
  } catch (error) {
    console.error("Error listing clients:", error);
    return {
      success: false,
      error: "Error al listar clients",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

