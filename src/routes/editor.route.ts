import { Elysia } from "elysia";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";

function generarHTMLDesdePlantilla(html: string, datos: Record<string, string>): string {
  return html.replace(/{{(.*?)}}/g, (_, key) => datos[key.trim()] || "");
}

export const editorRoutes = new Elysia({ prefix: "/editor" })
  .post("/guardar-json", async ({ body, set }) => {
    try {
      const {
        nombreEvento,
        design,
        excelBase64,
        bannerBase64,
        bannerNombre,
        metadata,
      } = body as {
        nombreEvento: string;
        design: any;
        excelBase64: string;
        bannerBase64: string;
        bannerNombre: string;
        metadata: Record<string, any>;
      };

      if (!nombreEvento || !design) {
        set.status = 400;
        return { error: "Faltan campos requeridos" };
      }

      const carpetaEvento = path.join(process.cwd(), "public", "planillas", nombreEvento);
      await mkdir(carpetaEvento, { recursive: true });

      // Guardar diseño Unlayer
      await writeFile(
        path.join(carpetaEvento, "plantilla.json"),
        JSON.stringify(design, null, 2)
      );

      // Guardar archivo Excel
      if (excelBase64) {
        const excelBuffer = Buffer.from(excelBase64, "base64");
        await writeFile(path.join(carpetaEvento, "datos.xlsx"), excelBuffer);
      }

      // Guardar banner
      if (bannerBase64 && bannerNombre) {
        const bannerBuffer = Buffer.from(bannerBase64, "base64");
        await writeFile(path.join(carpetaEvento, bannerNombre), bannerBuffer);
      }

      // Guardar metadatos del evento
      if (metadata) {
        await writeFile(
          path.join(carpetaEvento, "info.json"),
          JSON.stringify(metadata, null, 2)
        );
      }

      return {
        mensaje: `Evento '${nombreEvento}' guardado.`,
        url: `/planillas/${nombreEvento}/plantilla.json`,
      };
    } catch (err) {
      console.error(err);
      set.status = 500;
      return { error: "Error al guardar el evento" };
    }
  })

  .post("/generar-certificados", async ({ body, set }) => {
    try {
      const { nombreEvento, excelBase64, nombreArchivo } = body as {
        nombreEvento: string;
        excelBase64: string;
        nombreArchivo: string;
      };
      if (!nombreEvento || !excelBase64 || !nombreArchivo.endsWith(".xlsx")) {
        set.status = 400;
        return { error: "Parámetros inválidos o archivo no .xlsx" };
      }

      // Leer plantilla
      const plantillaPath = path.join(
        process.cwd(),
        "public",
        "planillas",
        nombreEvento,
        "plantilla.json"
      );
      const plantillaJSON = JSON.parse(await readFile(plantillaPath, "utf-8"));
      const plantillaHTML = plantillaJSON.html || plantillaJSON.htmlContent || "";

      // Procesar Excel
      const bufferExcel = Buffer.from(excelBase64, "base64");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(bufferExcel);
      const sheet = workbook.worksheets[0];
      const headers = sheet.getRow(1).values as string[];

      // Generar PDFs
      const pdfDir = path.join(process.cwd(), "public", "certificados", nombreEvento);
      await mkdir(pdfDir, { recursive: true });
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      for (let i = 2; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i).values as string[];
        const datos: Record<string, string> = {};
        for (let j = 1; j < headers.length; j++) {
          datos[headers[j]] = row[j] as string;
        }
        const htmlFinal = generarHTMLDesdePlantilla(plantillaHTML, datos);
        await page.setContent(htmlFinal, { waitUntil: "networkidle0" });
        const email = datos["email"]?.trim() || `user${i}`;
        await page.pdf({
          path: path.join(pdfDir, `${email}.pdf`),
          format: "A4",
          printBackground: true,
        });
      }
      await browser.close();

      return {
        mensaje: "Certificados generados correctamente.",
        rutaBase: `/certificados/${nombreEvento}/[email].pdf`,
      };
    } catch (err) {
      console.error(err);
      set.status = 500;
      return { error: "Error generando certificados" };
    }
  });
