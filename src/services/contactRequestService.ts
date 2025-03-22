import { db } from "../config/firebase";

export const listContactRequests = async () => {
  try {
    const contactRequestSnapshot = await db.collection('contactRequests').get();
    const contactRequests = contactRequestSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      contactRequests,
      count: contactRequests.length
    };
  } catch (error) {
    console.error("Error listing contact requests:", error);
    return {
      success: false,
      error: "Error al listar contactRequests",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

