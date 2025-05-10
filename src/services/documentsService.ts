import { db, app, db2 } from "../config/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getUserById } from "./usersService";
import { getClientById } from "./clientService";
import { Document } from "../types/document";
import { generateDoc } from "../types/generateDoc";

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
        return {
            success: false,
            error: "Error al listar documentos",
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
        return {
            success: true,
            data: {
                docRef: documentDoc.data()
            },
        };
    } catch (error) {
        return {
            success: false,
            error: "Error al listar document",
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
    if (!data) {
        return {
            success: false,
            error: "Error al crear el documento",
            details: "No se ha recibido data. Inténtelo nuevamente."
        };
    }

    // Validaciones de data (que no haya campos vacíos)
    let requiredFields = [
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

    if (data.uid) {
        requiredFields = requiredFields.filter((field) => field !== "xlsxFile");
    }

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
        return {
            success: false,
            error: "Error al crear el documento",
            details: `Los siguientes campos son obligatorios: ${missingFields.join(", ")}`
        };
    }

    try {
        let headers = [];
        let dataArray = [];
        // Leer el archivo xlsx y preparar datos
        if (data.xlsxFile) {
            const xlsxFile = await data.xlsxFile.arrayBuffer();
            const xlsx = require("xlsx");
            const workbook = xlsx.read(xlsxFile, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            headers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
            dataArray = xlsx.utils.sheet_to_json(worksheet, { header: headers }).slice(1);
        }

        let documentData = {
            name: data.name,
            description: data.description,
            category: data.category,
            downloadLink: data.downloadLink,
            header: data.header,
            pageFormat: "landscape",
            downloadHistory: [],
            bannerUrl: await uploadBanner(data.bannerImg),
            headers: headers,
            rows: dataArray, // eliminar la primera fila que son los headers
            design: data.design,
            showContactInfo: data.showContactInfo,
            url: "",
            template: data.template,
            clientId: data.clientId,
            createdBy: data.createdBy,
            updatedBy: data.createdBy,
            createdAt: new Date().toISOString(),
            createdate: new Date(),
            lastupdate: new Date()
        };

        if (headers.length === 0) {
            delete documentData.headers;
            delete documentData.rows;
        }

        if (!(data.bannerImg instanceof File) && documentData.bannerUrl) {
            // @ts-ignore
            delete documentData.bannerUrl;
        }

        const documentsRef = db2.collection("documents");

        if (data.uid) {
            // Si existe un `uid`, intentamos actualizar el documento existente
            const docRef = documentsRef.doc(data.uid);
            const existingDoc = await docRef.get();

            if (!existingDoc.exists) {
                return {
                    success: false,
                    error: "Documento no encontrado",
                    details: `No se encontró un documento con el uid proporcionado: ${data.uid}`
                };
            }

            // Actualización del documento existente
            await docRef.update({
                ...documentData,
                lastupdate: new Date() // Actualiza la fecha de la última modificación
            });

            return {
                success: true,
                message: "Documento actualizado correctamente.",
                id: data.uid,
                data: {
                    updatedDocument: {
                        ...documentData,
                        id: data.uid
                    }
                }
            };
        } else {
            // Si no existe `uid`, creamos un nuevo documento
            const docRef = await documentsRef.add(documentData);

            const finalUrl = `/Pixel_Code/certificado/${docRef.id}`;
            await docRef.update({ url: finalUrl });

            return {
                success: true,
                message: "Documento creado correctamente.",
                id: docRef.id,
                data: {
                    newDocument: {
                        ...documentData,
                        url: finalUrl
                    }
                }
            };
        }
    } catch (err) {
        console.error("Error al procesar el documento:", err);
        return {
            success: false,
            error: "Error al procesar el documento",
            details: err instanceof Error ? err.message : String(err)
        };
    }
};


export const refactorHtmlAndDownloadPdf = async (body: generateDoc) => {
    // 1. Obtener el documento por id
    const evento = await listDocumentById(body.idEvento);
    if (!evento.success) {
        return {
            success: false,
            error: "Error al obtener el documento",
            details: evento.error
        };
    }

    const eventoData = evento.data?.docRef;

    // 2. Buscar si es que el email existe dentro de los usuarios del documento encontrado por id (si no existe, retornar un mensaje de error)
    const participante = eventoData?.rows.find((row: any) => row.email === body.email);

    if (!participante) {
        return {
            success: false,
            error: "Usuario no encontrado",
            details: "El email proporcionado no se encuentra en la lista de participantes."
        };
    }

    // 3. Obtener el html del documento y reemplazar los datos del usuario (nombre, apellido, etc) por los datos del usuario que se encuentra en el documento
    let htmlContent = eventoData?.template;

    // 3.1 Buscar todas las variables del html que empiezan con {{ y terminan con }} y reemplazarlas por los datos del usuario de mismo nombre
    const regex = /{{(.*?)}}/g;
    const matches = htmlContent.match(regex);

    // 3.2 Extraer las dimensiones del diseño para el PDF
    let width = 612;
    let height = 450;

    if (matches) {
        matches.forEach((match: any) => {
            const variable = match.replace(/{{|}}/g, "").trim().toLowerCase();
            const value = participante[variable];
            htmlContent = htmlContent.replace(match, value);
        });
    }
    // 4. generar PDF con el html generado en el paso 3 y retornarlo como base64
    const pdf = require("html-pdf");
    const options = {
        orientation: "landscape",
        border: 0,
        quality: 100,
        width: "11in",
        height: "8.5in"
    };



    const pdfBuffer: any = await new Promise((resolve, reject) => {
        pdf.create(htmlContent, options).toBuffer((err: any, buffer: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
    const base64 = pdfBuffer.toString("base64");

    // 5. pasar el email a usuarios que descargaron el pdf
    const downloadHistory = eventoData?.downloadHistory || [];

    // Buscar si el email ya existe en el historial
    const existingEntry = downloadHistory.find((entry: any) => entry.email === body.email);

    if (existingEntry) {
        // Si existe, incrementar el contador de descargas
        existingEntry.downloads += 1;
    } else {
        // Si no existe, agregar un nuevo registro
        downloadHistory.push({
            email: body.email,
            downloads: 1,
        });
    }

    // Actualizar el historial de descargas en Firestore
    const documentRef = db2.collection("documents").doc(body.idEvento);
    await documentRef.update({
        downloadHistory: downloadHistory,
        lastupdate: new Date()
    });
    return {
        success: true,
        message: "PDF generado correctamente.",
        data: base64
    };
}

// servicio que reciba una imagen y retorne la url de la imagen en firestore
const uploadBanner = async (data: File) => {
    try {
        // Obtener referencia a Firebase Storage
        const storage = getStorage(app);
        const date = new Date().getTime();
        const fileName = `${date}_${data.name}`;
        const storageRef = ref(storage, `documents/banners/${fileName}`);

        // Subir el archivo a Firebase Storage
        const fileBuffer = await data.arrayBuffer();
        const metadata = { contentType: data.type };
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