import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";

import { clientRoutes } from "./routes/clientRoutes";
import { contactRequestsRoutes } from "./routes/contactRequestsRoutes";
import { documentsRoutes } from "./routes/documentsRoutes";
import { pricingPlansRoutes } from "./routes/pricingPlansRoutes";
import { servicesRoutes } from "./routes/servicesRoutes";
import { usersRoutes } from "./routes/usersRoutes";
import { authRoutes } from "./routes/authRoutes";
import { editorRoutes } from "./routes/editor.route"; 

const app = new Elysia({
    prefix: "/api/v1",
    serve: {
        idleTimeout: 255,
    }
})
    .get("/", () => "Hola mundo!")
    .use(cors())
    .use(staticPlugin({ assets: "public" }))
    .use(clientRoutes)
    .use(contactRequestsRoutes)
    .use(documentsRoutes)
    .use(pricingPlansRoutes)
    .use(servicesRoutes)
    .use(usersRoutes)
    .use(authRoutes)
    .use(editorRoutes);

function logApiEndpoints() {
    console.log('\n======================================================');
    console.log('=               API ENDPOINTS DISPONIBLES             =');
    console.log('======================================================\n');

    console.log('SOLICITUDES DE CONTACTO:');
    console.log('- GET    http://localhost:3000/api/v1/contactRequests');
    console.log('- POST   http://localhost:3000/api/v1/contactRequests');

    console.log('\nUSUARIOS:');
    console.log('- GET    http://localhost:3000/api/v1/users');

    console.log('\nDOCUMENTOS:');
    console.log('- GET    http://localhost:3000/api/v1/documents');

    console.log('\nSERVICIOS:');
    console.log('- GET    http://localhost:3000/api/v1/services');

    console.log('\nPLANES DE PRECIOS:');
    console.log('- GET    http://localhost:3000/api/v1/pricingPlans');

    console.log('\nAUTENTICACIÓN:');
    console.log('- POST   http://localhost:3000/auth/login');

    console.log('\nEDITOR (UNLAYER):');
    console.log('- POST   http://localhost:3000/api/v1/editor/guardar-json');

    console.log('\n======================================================\n');
}

if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT ?? 3000, () => {
        logApiEndpoints();
        console.log(`🦊 Servicio corriendo en ${app.server?.hostname}:${app.server?.port}`);
    });
}

export default app.fetch;
