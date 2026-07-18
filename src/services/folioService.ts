import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const FOLIO_INICIAL = 10100;
const REF = () => doc(db, "config", "folios");

export async function asignarFolios(filas: any[]): Promise<any[]> {
    const snap = await getDoc(REF());
    const ultimoFolio = snap.exists() ? snap.data()!.ultimo_folio : FOLIO_INICIAL;

    const filasConFolio = filas.map((fila, i) => ({
        ...fila,
        folio: ultimoFolio + 1 + i,
    }));

    await setDoc(REF(), { ultimo_folio: ultimoFolio + filas.length }, { merge: true });

    return filasConFolio;
}
