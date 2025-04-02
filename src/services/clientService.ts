import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Client } from "../types/client";

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

    // const clientsRef = getDocs(collection(db, 'clients'));
    // const docRef = await addDoc(clientsRef, client);
    
    return {
      success: true,
      msg: "Contacto registrado correctamente: " + client.nombres + " " + client.apellidos,
      // id: docRef.id
    };
  } catch (error) {
    return {
      success: false,
      error: "Error al registrar el cliente",
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

export const listClients = async () => {
  try {
    const clientsRef = collection(db, 'clients');
    const clientsSnapshot = await getDocs(clientsRef);
    
    const data = clientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data,
      count: data.length
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
