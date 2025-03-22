import { Elysia } from "elysia";
import { clientRoutes } from "./routes/clientRoutes";
import { contactRequestsRoutes } from "./routes/contactRequestsRoutes";
import {documentsRoutes} from "./routes/documentsRoutes";

const app = new Elysia({ prefix: "/api/v1" })
    .get("/", () => "Hola mundo!")
    .use(clientRoutes)
    .use(contactRequestsRoutes)
    .use(documentsRoutes)
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
