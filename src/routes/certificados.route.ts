import { Elysia } from "elysia";
import * as path from "path";
import * as fs from "fs/promises";
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";

function generarHTMLDesdePlantilla(html: string, datos: Record<string, string>) {
    return html.replace(/\{\{(.*?)\}\}/g, (_, key) => datos[key.trim().toLowerCase()] || "");
}

export const certificadosRoutes = new Elysia({ prefix: "/certificados" })
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

      const plantillaPath = path.join(
        process.cwd(),
        "public",
        "planillas",
        nombreEvento,
        "plantilla.json"
      );
      const plantillaJSON = JSON.parse(await fs.readFile(plantillaPath, "utf-8"));
      const plantillaHTML = plantillaJSON.html || plantillaJSON.htmlContent || "";

      const bufferExcel = Buffer.from(excelBase64, "base64");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(bufferExcel);
      const sheet = workbook.worksheets[0];

      const headerRow = sheet.getRow(1).values as string[];
      const headers = headerRow
        .map((h) => typeof h === "string" ? h.trim().toLowerCase() : "")
        .filter((h) => h);

      const pdfDir = path.join(process.cwd(), "public", "certificados", nombreEvento);
      await fs.mkdir(pdfDir, { recursive: true });

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      for (let i = 2; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i).values as string[];
        const datos: Record<string, string> = {};
        headers.forEach((key, idx) => {
          datos[key] = (row[idx + 1] as string || "").trim();
        });

        const htmlFinal = generarHTMLDesdePlantilla(plantillaHTML, datos);
        await page.setContent(htmlFinal, { waitUntil: "networkidle0" });

        const email = datos["email"] || `user${i}@example.com`;
        const safeEmail = email.replace(/[^a-zA-Z0-9@.]/g, "_");
        const fileName = `${safeEmail}.pdf`;

        await page.pdf({
          path: path.join(pdfDir, fileName),
          format: "A4",
          printBackground: true,
        });
      }

      await browser.close();

      return {
        mensaje: "Certificados generados correctamente.",
        rutaBase: `/certificados/${nombreEvento}/<email>.pdf`,
      };
    } catch (err) {
      console.error(err);
      set.status = 500;
      return { error: "Error generando certificados" };
    }
  });

  