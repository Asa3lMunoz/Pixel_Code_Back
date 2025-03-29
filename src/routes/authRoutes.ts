import {Elysia} from "elysia";
import {loginUser} from "../controllers/authController";
import {UserData} from "../types/auth";

export const authRoutes = new Elysia({prefix: "/auth"})
    .post("/login", async (req) => {
        const {email, password} = req.body as UserData;
        return await loginUser({email, password});
    });