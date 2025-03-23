import { db } from "../config/firebase";

export const listPricingPlans = async () => {
  try {
    const pricingPlans = await db.collection('pricingPlans').get();
    const data = pricingPlans.docs.map(doc => ({
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
      error: "Error al listar pricingPlans",
      details: error instanceof Error ? error.message : String(error)
    };
  }
};

