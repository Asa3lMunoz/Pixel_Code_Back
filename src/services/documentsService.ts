import {db, app, db2} from "../config/firebase";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import {getUserById} from "./usersService";
import {getClientById} from "./clientService";
import {Document} from "../types/document";

export const listDocuments = async () => {
    try {
        const documentsSnapshot = await getDocs(collection(db, "documents"));
        const data = await Promise.all(documentsSnapshot.docs.map(async (doc) => ({
            id: doc.id,
            createdByData: await getUserById(doc.data().createdBy),
            clientData: await getClientById(doc.data().clientId),
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

export const listDocumentById = async (id: string) => {
    try {
        const documentDoc = await getDoc(doc(db, 'documents', id));

        if (!documentDoc.data()) {
            return {
                success: false,
                error: "Documento no encontrado",
            };
        }
        // const createdByData = await getUserById(documentDoc.createdBy);
        // const clientData = await getClientById(documentDoc.clientId);

        return {
            success: true,
            data: {
                docRef: documentDoc.data()
            },
        };
    } catch (error) {
        console.error("Error listing contact requests:", error);
        return {
            success: false,
            error: "Error al listar documents",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}

export const deleteDocumentById = async (id: string) => {
    try {
        const documentDoc = await getDoc(doc(db, 'documents', id));

        if (!documentDoc.data()) {
            return {
                success: false,
                error: "Documento no encontrado",
            };
        }

        await db2.collection("documents").doc(id).delete();
        return {
            success: true,
            message: "Documento eliminado correctamente.",
        };
    } catch (error) {
        console.error("Error deleting document:", error);
        return {
            success: false,
            error: "Error al eliminar el documento",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}

export const createDocument = async (data: Document) => {
    // Validaciones de data (que no haya campos vacíos)
    const requiredFields = [
        "name",
        "description",
        "category",
        "downloadLink",
        "header",
        "documentFormat",
        "bannerImg",
        "xlsxFile",
        "clientId",
        "createdBy",
        "design",
        "showContactInfo",
        "template"
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
        return {
            success: false,
            error: "Error al crear el documento",
            details: `Los siguientes campos son obligatorios: ${missingFields.join(", ")}`
        };
    }

    try {
        // Leer el archivo xlsx y dejar en un array la primera fila que son los headers
        const xlsxFile = await data.xlsxFile.arrayBuffer();
        const xlsx = require("xlsx");
        const workbook = xlsx.read(xlsxFile, {type: "array"});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const headers = xlsx.utils.sheet_to_json(worksheet, {header: 1})[0];
        const dataArray = xlsx.utils.sheet_to_json(worksheet, {header: headers});

        const newDocument = {
            name: data.name,
            description: data.description,
            category: data.category,
            downloadLink: data.downloadLink,
            header: data.header,
            documentFormat: data.documentFormat,
            bannerImg: await uploadBanner(data.bannerImg),
            headers: headers,
            rows: dataArray.pop(0), // eliminar la primera fila que son los headers
            design: JSON.stringify(data.design),
            showContactInfo: data.showContactInfo,
            url: "TODO",
            template: data.template,
            clientId: data.clientId,
            createdBy: data.createdBy,
            updatedBy: data.createdBy,
            createdAt: new Date().toISOString(),
            createdate: new Date(),
            lastupdate: new Date()
        }

        const documentsRef = await db2.collection("documents");
        const docRef = await documentsRef.add(newDocument);
        return {
            success: true,
            message: "Documento creado correctamente.",
            id: docRef.id,
            data: {
                newDocument,
            },
        };
    } catch (error) {
        console.error("Error creating document:", error);
        return {
            success: false,
            error: "Error al crear el documento",
            details: error instanceof Error ? error.message : String(error)
        };
    }
}



// servicio que reciba una imagen y retorne la url de la imagen
const uploadBanner = async (data: File) => {
    try {
        // Obtener referencia a Firebase Storage
        const storage = getStorage(app);
        const date = new Date().getTime();
        const fileName = `${date}_${data.name}`;
        const storageRef = ref(storage, `documents/banners/${fileName}`);

        // Subir el archivo a Firebase Storage
        const fileBuffer = await data.arrayBuffer();
        const metadata = {contentType: data.type};
        const uploadTask = await uploadBytesResumable(storageRef, fileBuffer, metadata);

        return await getDownloadURL(uploadTask.ref)

    } catch (error) {
        return {
            success: false,
            error: "Error al subir la imagen",
            details: error instanceof Error ? error.message : String(error)
        };
    }
};