import { Elysia } from "elysia";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const editorRoutes = new Elysia({ prefix: "/editor" })
  .post("/guardar-json", async ({ body, set }) => {
    try {
      const { nombreEvento, diseño } = body as {
        nombreEvento: string;
        diseño: any;
      };

      if (!nombreEvento || !diseño) {
        set.status = 400;
        return {
          error: "Faltan datos requeridos: 'nombreEvento' y/o 'diseño'"
        };
      }

      const rutaCarpeta = path.join(process.cwd(), "public", "plantillas");
      const rutaArchivo = path.join(rutaCarpeta, `${nombreEvento}.json`);

      // Crear la carpeta si no existe
      await mkdir(rutaCarpeta, { recursive: true });

      // Guardar el JSON
      await writeFile(rutaArchivo, JSON.stringify(diseño, null, 2));

      return {
        mensaje: `Plantilla guardada como ${nombreEvento}.json`,
        ruta: `/plantillas/${nombreEvento}.json`
      };
    } catch (error) {
      console.error("Error al guardar plantilla:", error);
      set.status = 500;
      return { error: "Error interno del servidor" };
    }
  });
