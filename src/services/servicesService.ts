import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export const listServices = async () => {
  try {
    const services = await getDocs(collection(db, "services"));
    const data = services.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data,
      count: data.length
    };
  } catch (error) {
    console.error("Error listing contact requests:", error);
    return {
      success: false,
      error: "Error al listar services",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

