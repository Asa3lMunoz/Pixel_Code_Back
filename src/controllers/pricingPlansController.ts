import {listPricingPlans} from "../services/pricingPlansService";

export const getPricingPlans = async () => {
    return await listPricingPlans();
}