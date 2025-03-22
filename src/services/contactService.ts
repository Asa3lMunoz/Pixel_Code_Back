import { db } from "../config/firebase";

export const listContacts = async () => {
  try {
    const contactsSnapshot = await db.collection('clients').get();
    const contacts = contactsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      contacts,
      count: contacts.length
    };
  } catch (error) {
    console.error("Error listing contacts:", error);
    return {
      success: false,
      error: "Error al listar contactos",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

