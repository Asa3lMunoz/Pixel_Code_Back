import { db } from "../config/firebase";

export const listDocuments = async () => {
  try {
    const documentsSnapshot = await db.collection('documents').get();
    const data = documentsSnapshot.docs.map(doc => ({
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
      error: "Error al listar documents",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

