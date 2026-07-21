import { db, app, db2, storageApp } from "../config/firebase";
import { asignarFolios } from "./folioService";
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
        console.log("xlsxFile recibido:", !!data.xlsxFile);
        // Leer el archivo xlsx y preparar datos
        if (data.xlsxFile) {
            const xlsxFile = await data.xlsxFile.arrayBuffer();
            const xlsx = require("xlsx");
            const workbook = xlsx.read(xlsxFile, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            headers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
            dataArray = xlsx.utils.sheet_to_json(worksheet, { header: headers }).slice(1);
            console.log("dataArray antes:", JSON.stringify(dataArray[0]));
            dataArray = await asignarFolios(dataArray);
            console.log("dataArray después:", JSON.stringify(dataArray[0]));
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
            design: typeof data.design === 'string' ? data.design : JSON.stringify(data.design),
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
    try {
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
    const designObj = typeof eventoData?.design === 'string'
        ? JSON.parse(eventoData.design)
        : eventoData?.design;
    // 2. Buscar participante por email O por folio (el frontend puede enviar cualquiera de los dos)
    if (!body.email && !body.folio) {
        return {
            success: false,
            error: "Datos insuficientes",
            details: "Debe proporcionar un email o un número de folio."
        };
    }

    const participante = eventoData?.rows.find((row: any) => {
        const matchEmail = body.email && row.email === body.email;
        const matchFolio = body.folio && Number(row.folio) === Number(body.folio);
        return matchEmail || matchFolio;
    });

    if (!participante) {
        return {
            success: false,
            error: "Participante no encontrado",
            details: "El email o folio proporcionado no coincide con ningún participante."
        };
    }

    // 3. Obtener el html del documento y reemplazar los datos del usuario (nombre, apellido, etc) por los datos del usuario que se encuentra en el documento
    let htmlContent = eventoData?.template;

    // 3.1 Buscar todas las variables del html que empiezan con {{ y terminan con }} y reemplazarlas por los datos del usuario de mismo nombre
    const regex = /{{(.*?)}}/g;
    const matches = htmlContent.match(regex);

    // 3.2 Extraer las dimensiones del diseño para el PDF
    let width = designObj.body.rows[0].values.backgroundImage.width + "px";
    let height = designObj.body.rows[0].values.backgroundImage.height + "px";

    if (matches) {
        matches.forEach((match: any) => {
            const variable = match.replace(/{{|}}/g, "").trim().toLowerCase();
            // Búsqueda case-insensitive: soporta {{Nombre}}, {{nombre}}, {{folio}}, etc.
            const key = Object.keys(participante).find(k => k.toLowerCase() === variable);
            let value = key !== undefined ? participante[key] : undefined;

            if (value == undefined) {
                value = "";
            }

            htmlContent = htmlContent.replace(match, value);
        });
    }
    // 4. generar PDF con el html generado en el paso 3 y retornarlo como base64
    const pdf = require("html-pdf");

    // este método funciona SOLOOO EN DOCKER. cuando se ejecute en local se ejecutarán los documentos incorrectamente.
    const options = {
        type: "pdf",
        format: "A4",
        orientation: "landscape",
        width: width,
        height: height,
        border: "0",
        phantomPath: require('phantomjs-prebuilt').path,
        phantomArgs: ['--web-security=no', '--ignore-ssl-errors=yes'],
        renderDelay: 1000,
        timeout: 30000
    };

    // Add a wrapper div with explicit dimensions
    htmlContent = `
        <div style="width: ${width}; height: ${height}; overflow: hidden; position: relative;">
            ${htmlContent}
        </div>
    `;

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

    // Buscar historial por el folio del participante (fuente de verdad de la BD)
    const existingEntry = downloadHistory.find(
        (entry: any) => entry.folio === participante.folio
    );

    if (existingEntry) {
        existingEntry.downloads += 1;
    } else {
        downloadHistory.push({
            email: participante.email,
            folio: participante.folio,
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
    } catch (err) {
        console.error("Error en refactorHtmlAndDownloadPdf:", err);
        return {
            success: false,
            error: "Error al generar el certificado",
            details: err instanceof Error ? err.message : String(err)
        };
    }
}

// servicio que reciba una imagen y retorne la url de la imagen en firestore
const uploadBanner = async (data: File) => {
    try {
        // Obtener referencia a Firebase Storage
        const storage = getStorage(storageApp);
        const date = new Date().getTime();
        const fileName = `${date}_${data.name}`;
        const storageRef = ref(storage, `documents/banners/${fileName}`);

        // Subir el archivo a Firebase Storage
        const fileBuffer = await data.arrayBuffer();
        const metadata = { contentType: data.type };
        const uploadTask = await uploadBytesResumable(storageRef, fileBuffer, metadata);

        return await getDownloadURL(uploadTask.ref)

    } catch (error) {
        console.error("Error al subir banner:", error instanceof Error ? error.message : String(error));
        return {
            success: false,
            error: "Error al subir la imagen",
            details: error instanceof Error ? error.message : String(error)
        };
    }
};