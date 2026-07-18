import { db2 } from "../config/firebase";

const FOLIO_INICIAL = 10100;
const REF = () => db2.collection("config").doc("folios");

export async function asignarFolios(filas: any[]): Promise<any[]> {
    const snap = await REF().get();
    const ultimoFolio = snap.exists ? snap.data()!.ultimo_folio : FOLIO_INICIAL;

    const filasConFolio = filas.map((fila, i) => ({
        ...fila,
        folio: ultimoFolio + 1 + i,
    }));

    await REF().set({ ultimo_folio: ultimoFolio + filas.length }, { merge: true });

    return filasConFolio;
}
