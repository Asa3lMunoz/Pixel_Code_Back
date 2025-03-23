import {Elysia} from "elysia";
import {clientRoutes} from "./routes/clientRoutes";
import {contactRequestsRoutes} from "./routes/contactRequestsRoutes";
import {documentsRoutes} from "./routes/documentsRoutes";
import {pricingPlansRoutes} from "./routes/pricingPlansRoutes";
import {servicesRoutes} from "./routes/servicesRoutes";
import {usersRoutes} from "./routes/usersRoutes";

const app = new Elysia({
        prefix: "/api/v1",
    serve: {
        idleTimeout: 255,
    }
})
    .get("/", () => "Hola mundo!")
    .use(clientRoutes)
    .use(contactRequestsRoutes)
    .use(documentsRoutes)
    .use(pricingPlansRoutes)
    .use(servicesRoutes)
    .use(usersRoutes)
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
