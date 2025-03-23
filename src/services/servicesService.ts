import { db } from "../config/firebase";

export const listServices = async () => {
  try {
    const services = await db.collection('services').get();
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

