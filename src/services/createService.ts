import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Service } from "../types/service";

export const createService = async (service: Service) => {
    try {
        let campoFaltante = '';

        if (!service.nombre) {
            campoFaltante = 'nombre';
        } else if (!service.descripcion) {
            campoFaltante = 'descripcion';
        } else if (!service.categoria) {
            campoFaltante = 'categoria';
        } else if (!service.link) {
            campoFaltante = 'link';
        } else if (!service.encabezado) {
            campoFaltante = 'encabezado';
        } else if (!service.bajadapage) {
            campoFaltante = 'bajada';
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
            msg: "Campos completados correctamente: " + service.nombre + " " + service.descripcion + "" + service.categoria + "" + service.link + "" + service.encabezado + "" + service.bajadapage,
            // id: docRef.id
        };
    } catch (error) {
        return {
            success: false,
            error: "Error al registrar los campos",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}

export const listService = async () => {
    try {
        const serviceRef = collection(db, 'service');
        const serviceSnapshot = await getDocs(serviceRef);

        const data = serviceSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            success: true,
            data,
            count: data.length
        };
    } catch (error) {
        console.error("Error listing service:", error);
        return {
            success: false,
            error: "Error al listar el servicio",
            details: error instanceof Error ? error.message : String(error)
        };
    }
};

export const getServiceById = async (id: string) => {
    try {
        const serviceDoc = await getDoc(doc(db, 'service', id));
        if (!serviceDoc.exists()) {
            return {
                success: false,
                error: "Service no encontrado"
            };
        }

        return {
            success: true,
            data: serviceDoc.data(),
        };
    } catch (error) {
        console.error("Error obteniendo servicio por ID:", error);
        return {
            success: false,
            error: "Error al obtener servicio",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}