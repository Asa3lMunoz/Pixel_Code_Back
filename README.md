# Servicio backend con Bun y Elysia

## Configurando el proyecto
Este proyecto cuenta con la estructura de backend utilizando Bun y Elysia, siendo Bun un framework de desarrollo y Elysia un ORM para Node.js.

Para instalar bun, debes ejecutar el siguiente comando en la powershell o cmd:
```bash
powershell -c "irm bun.sh/install.ps1|iex"
```


Para instalar las dependencias, ejecuta el siguiente comando:
```bash
bun install
```
Eso sería todo.

## Desarrollo
Para comenzar con el desarrollo, ejecuta el siguiente comando:
```bash
bun run dev
```
Abre http://localhost:3000/ en el navegador para ver un "Hola mundo!".

## Rutas de la API

A continuación se presentan los endpoints disponibles:

### Solicitudes de Contacto
- `GET http://localhost:3000/api/v1/contactRequests` - Listar todas las solicitudes de contacto
- `POST http://localhost:3000/api/v1/contactRequests` - Crear una nueva solicitud de contacto

### Usuarios
- `GET http://localhost:3000/api/v1/users` - Listar todos los usuarios

### Documentos
- `GET http://localhost:3000/api/v1/documents` - Listar todos los documentos

### Servicios
- `GET http://localhost:3000/api/v1/services` - Listar todos los servicios

### Planes de Precios
- `GET http://localhost:3000/api/v1/pricingPlans` - Listar todos los planes de precios

### Ejemplo de Petición POST

```json
// POST http://localhost:3000/api/v1/contactRequests
{
  "nombres": "Mario",
  "apellidos": "Gómez",
  "email": "mralejandrogu@gmail.com",
  "telefono": "979791878",
  "mensaje": "Hola, me gustaría recibir más información sobre sus servicios."
}