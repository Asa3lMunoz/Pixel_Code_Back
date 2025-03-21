import { Elysia, t } from "elysia";
import { registerContact } from "../controllers/contactController";

export const contactRoutes = (app: Elysia) =>
    app.post("/registro-contacto",
        ({ body }) => registerContact(body), {
            body: t.Object({
                nombres: t.String(),
                apellidos: t.String(),
                email: t.String(),
                telefono: t.String(),
                mensaje: t.String()
            })
        }
    );