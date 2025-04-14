import { Elysia } from "elysia";
import { writeFile } from "fs/promises";
import path from "path";
import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export const editorRoutes = new Elysia({ prefix: "/api/v1/editor" })
  .post("/guardar-json", async ({ body, set }) => {
    const { design, nombreEvento } = body as {
      design: object;
      nombreEvento: string;
    };

    if (!design || !nombreEvento) {
      set.status = 400;
      return { error: "Faltan datos: 'design' o 'nombreEvento'" };
    }

    const safeName = nombreEvento.trim().replace(/[^a-zA-Z0-9-_]/g, "_");
    const filename = `${safeName}.json`;
    const outputPath = path.join(process.cwd(), "public", "plantillas", filename);

    try {
      await writeFile(outputPath, JSON.stringify(design, null, 2), "utf-8");

      return {
        message: "Diseño guardado correctamente",
        url: `/plantillas/${filename}`,
      };
    } catch (err) {
      console.error("Error al guardar el diseño:", err);
      set.status = 500;
      return { error: "Error interno al guardar el diseño" };
    }
  });
