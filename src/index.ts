import {Elysia} from "elysia";
import {cors} from "@elysiajs/cors";
import {clientRoutes} from "./routes/clientRoutes";
import {contactRequestsRoutes} from "./routes/contactRequestsRoutes";
import {documentsRoutes} from "./routes/documentsRoutes";
import {pricingPlansRoutes} from "./routes/pricingPlansRoutes";
import {servicesRoutes} from "./routes/servicesRoutes";
import {usersRoutes} from "./routes/usersRoutes";
import {authRoutes} from "./routes/authRoutes";
import {editorRoutes} from "./routes/editor.route";

export const app = new Elysia({
    prefix: "/api/v1",
    serve: {
        idleTimeout: 255,
    },
})
    .get("/", () => "Hola mundo!")
    .use(cors())
    .use(clientRoutes)
    .use(contactRequestsRoutes)
    .use(documentsRoutes)
    .use(pricingPlansRoutes)
    .use(servicesRoutes)
    .use(usersRoutes)
    .use(authRoutes)
    // Editor de Unlayer
    .use(editorRoutes)


function logApiEndpoints() {
    console.log("\n======================================================");
    console.log("=               API ENDPOINTS DISPONIBLES             =");
    console.log("======================================================\n");

    console.log("CONTACT REQUESTS:");
    console.log("- GET     http://localhost:3000/api/v1/contactRequests");
    console.log("- POST    http://localhost:3000/api/v1/contactRequests");

    console.log("\nUSERS:");
    console.log("- GET     http://localhost:3000/api/v1/users");

    console.log("\nDOCUMENTS:");
    console.log("- GET     http://localhost:3000/api/v1/documents");
    console.log("- POST    http://localhost:3000/api/v1/documents");
    console.log("- DELETE  http://localhost:3000/api/v1/documents/{id}");

    console.log("\nSERVICES:");
    console.log("- GET    http://localhost:3000/api/v1/services");

    console.log("\nPRICING PLANS:");
    console.log("- GET    http://localhost:3000/api/v1/pricingPlans");

    console.log("\nAUTH:");
    console.log("- POST   http://localhost:3000/api/v1/auth/login");

    console.log("\nEDITOR (UNLAYER):");
    console.log("- POST   http://localhost:3000/api/v1/editor/guardar-json  ← Guarda diseño Unlayer");


    console.log("\n======================================================\n");
}

if (typeof process !== "undefined") {
    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
        // logApiEndpoints();
        console.log(`🦊 Servicio corriendo en ${app.server?.hostname}:${app.server?.port}`);
    });
}

export default app.fetch;
