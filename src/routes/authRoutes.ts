import {Elysia} from "elysia";
import {loginUser, signUpUser} from "../controllers/authController";
import {UserData} from "../types/auth";

export const authRoutes = new Elysia({prefix: "/auth"})
    .post("/login", async (req: { body: UserData }) => {
        const {email, password} = req.body;
        return await loginUser({email, password});
    })
    .post("/signup", async (req: { body: UserData }) => {
        const {nombre, apellido, email, password} = req.body;
        return await signUpUser({nombre, apellido, email, password});
    });