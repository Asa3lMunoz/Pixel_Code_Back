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

También hay una ruta de prueba en http://localhost:3000/registro-contacto que simula el registro de un nuevo contacto. Para probarla, puedes utilizar Postman o cualquier otra herramienta similar.
La solicitud debe ser de tipo POST y enviar un JSON con los siguientes campos:
```json
{
  "nombres": "",
  "apellidos": "",
  "email": "",
  "telefono": "",
  "mensaje": ""
}
```
Si todo sale bien, recibirás el siguiente mensaje de respuesta:
```json
{
  "success": true,
  "msg": "Contacto registrado correctamente: <nombre> <apellido>"
}
```