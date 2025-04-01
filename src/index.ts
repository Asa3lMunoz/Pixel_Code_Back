import {Elysia} from "elysia";
import {clientRoutes} from "./routes/clientRoutes";
import {contactRequestsRoutes} from "./routes/contactRequestsRoutes";
import {documentsRoutes} from "./routes/documentsRoutes";
import {pricingPlansRoutes} from "./routes/pricingPlansRoutes";
import {servicesRoutes} from "./routes/servicesRoutes";
import {usersRoutes} from "./routes/usersRoutes";
import {authRoutes} from "./routes/authRoutes";

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
    .use(authRoutes)
    .listen(Bun.env.PORT ?? 3000);

console.log(
    `🦊 Servicio corriento en ${app.server?.hostname}:${app.server?.port}`
);

// Función para mostrar los endpoints disponibles en la consola
function logApiEndpoints() {
  console.log('\n======================================================');
  console.log('=               API ENDPOINTS DISPONIBLES             =');
  console.log('======================================================\n');
  
  // Solicitudes de Contacto
  console.log('SOLICITUDES DE CONTACTO:');
  console.log('- GET    http://localhost:3000/api/v1/contactRequests  - Listar todas las solicitudes');
  console.log('- POST   http://localhost:3000/api/v1/contactRequests  - Crear una nueva solicitud');
  console.log('  Ejemplo POST Body:');
  console.log(`  {
    "nombres": "Mario",
    "apellidos": "Gómez",
    "email": "mralejandrogu@gmail.com",
    "telefono": "979791878",
    "mensaje": "Hola, me gustaría recibir más información sobre sus servicios."
  }`);
  
  // Usuarios
  console.log('\nUSUARIOS:');
  console.log('- GET    http://localhost:3000/api/v1/users            - Listar todos los usuarios');
  
  // Documentos
  console.log('\nDOCUMENTOS:');
  console.log('- GET    http://localhost:3000/api/v1/documents        - Listar todos los documentos');
  
  // Servicios
  console.log('\nSERVICIOS:');
  console.log('- GET    http://localhost:3000/api/v1/services         - Listar todos los servicios');
  
  // Planes de Precios
  console.log('\nPLANES DE PRECIOS:');
  console.log('- GET    http://localhost:3000/api/v1/pricingPlans     - Listar todos los planes de precios');
  
  // Autenticación
  console.log('\nAUTENTICACIÓN:');
  console.log('- POST   http://localhost:3000/auth/login              - Iniciar sesión');
  console.log('  Ejemplo POST Body:');
  console.log(`  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }`);
  
  console.log('\n======================================================\n');
}

// Llamar a la función para mostrar los endpoints después de que el servidor se inicie
app.listen(Bun.env.PORT ?? 3000, () => {
  logApiEndpoints();
});
