import { Elysia } from "elysia";
import { contactRoutes } from "./routes/contactRoutes";
import 'dotenv/config'

const app = new Elysia()
    .get("/", () => "Hola mundo!")
    .use(contactRoutes)
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
