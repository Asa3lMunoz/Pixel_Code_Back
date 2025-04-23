// routes/certificados.route.ts

import { Elysia } from "elysia";
import { readFile } from "fs/promises";
import path from "path";

export const certificadosRoutes = new Elysia({ prefix: "/certificados" })
  .get("/:evento", async ({ params, query, set }) => {
    const { evento } = params;
    const { email } = query as { email?: string };

    // 1) Validación de parámetros
    if (!email) {
      set.status = 400;
      return { error: "Falta parámetro 'email'" };
    }

    // 2) Construir ruta al PDF
    // Sanitizamos el email para evitar path traversal
    const safeEmail = email.replace(/[^a-zA-Z0-9@\.\-_]/g, "");
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "certificados",
      evento,
      `${safeEmail}.pdf`
    );

    // 3) Intentar leer el archivo
    try {
      const data = await readFile(pdfPath);

      // 4) Enviar PDF con cabeceras para descarga
      set.headers["Content-Type"] = "application/pdf";
      set.headers["Content-Disposition"] = `attachment; filename="${safeEmail}.pdf"`;
      return data;
    } catch (err) {
      // 5) Si no existe o hay otro error, devolvemos 404
      set.status = 404;
      return { error: "Certificado no encontrado para ese email" };
    }
  });
