import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export const listUsers = async () => {
  try {
    const users = await getDocs(collection(db, "users"));
    const data = users.docs.map(doc => ({
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
      error: "Error al listar users",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

