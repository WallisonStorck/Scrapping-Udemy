// import puppeteer from "puppeteer";
// import saveSalesData from "./saveSalesData.js";
// import { logger } from "./logger.js";

// export default async function fetchSalesData(courseUrl) {
//   const browser = await puppeteer.launch({
//     headless: false, // ou 'new' se estiver usando Puppeteer moderno
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });
//   const page = await browser.newPage();

//   try {
//     await page.goto(courseUrl, { waitUntil: "networkidle2" });

//     // Espera os seletores essenciais carregarem
//     await page.waitForSelector(".enrollment", { timeout: 30000 });
//     await page.waitForSelector("h1[data-purpose='lead-title']", {
//       timeout: 30000,
//     });

//     const salesData = await page.evaluate(() => {
//       const titleEl = document.querySelector("h1[data-purpose='lead-title']");
//       const enrollmentEl =
//         document.querySelector(".enrollment") ||
//         document.querySelector("span.ud-heading-sm");

//       const title = titleEl?.innerText.trim() || "Título não encontrado";
//       const enrollmentText = enrollmentEl?.innerText || "0";
//       const sales = parseInt(enrollmentText.match(/\d+/g)?.join("") || "0");

//       return {
//         titleCurrent: title,
//         salesCurrent: sales,
//         timestamp: new Date().toLocaleString(),
//       };
//     });

//     await browser.close();

//     logger(`Dados coletados: ${JSON.stringify(salesData, null, 2)}`);
//     saveSalesData(salesData);
//   } catch (error) {
//     logger(`Erro ao buscar os seletores: ${JSON.stringify(error, null, 2)}`);
//     await page.screenshot({ path: "error_screenshot.png" });
//     await browser.close();
//   }
// }

import puppeteer from "puppeteer";
import saveSalesData from "./saveSalesData.js";
import { logger } from "./logger.js";

export default async function fetchSalesData(courseUrl) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // defaultViewport: null, // opcional: usa viewport da janela
  });

  const page = await browser.newPage();

  try {
    await page.goto(courseUrl, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });

    // (Opcional) tenta aceitar cookies se aparecer um banner
    try {
      await page.waitForSelector(
        "button[aria-label*='Accept'], button[aria-label*='Aceitar']",
        { timeout: 3000 }
      );
      await page.click(
        "button[aria-label*='Accept'], button[aria-label*='Aceitar']"
      );
    } catch {}

    // Aguarda aparecer QUALQUER um dos seletores possíveis
    const TIMEOUT = 45000;
    await page.waitForFunction(
      () => {
        return (
          document.querySelector(".enrollment") ||
          document.querySelector("span.ud-heading-sm") ||
          document.querySelector("[data-purpose*='enrollment']") ||
          document.querySelector("div[data-purpose='enrollment-figure'] span")
        );
      },
      { timeout: TIMEOUT }
    );

    const salesData = await page.evaluate(() => {
      const getTitle = () => {
        const el = document.querySelector("h1[data-purpose='lead-title']");
        return el?.innerText.trim() || "Título não encontrado";
      };

      // Tenta vários seletores; se falhar, tenta por heurística de texto
      const getEnrollmentText = () => {
        const candidates = [
          ".enrollment",
          "[data-purpose='enrollment']",
          "div[data-purpose='enrollment-figure'] span",
          "span.ud-heading-sm",
        ];

        for (const sel of candidates) {
          const el = document.querySelector(sel);
          const txt = el?.textContent?.trim();
          if (txt && /\d/.test(txt)) return txt;
        }

        // Fallback: procura spans/divs com número + "students"/"inscritos"
        const nodes = Array.from(document.querySelectorAll("span, div"));
        const n = nodes.find((node) => {
          const t = node.textContent?.trim() || "";
          return /\d/.test(t) && /(students?|inscritos?)/i.test(t);
        });
        return n?.textContent?.trim() || null;
      };

      const title = getTitle();
      const enrollmentText = getEnrollmentText() || "0";
      const sales = parseInt(
        (enrollmentText.match(/\d+/g) || []).join("") || "0",
        10
      );

      return {
        titleCurrent: title,
        salesCurrent: sales,
        timestamp: new Date().toLocaleString(),
      };
    });

    logger(`Dados coletados: ${JSON.stringify(salesData, null, 2)}`);
    saveSalesData(salesData);
  } catch (error) {
    logger(
      `Erro ao buscar os seletores: ${error?.name || error} - ${
        error?.message || ""
      }`
    );
    try {
      await page.screenshot({ path: "error_screenshot.png" });
    } catch {}
  } finally {
    try {
      await browser.close();
    } catch {}
  }
}
