import puppeteer from "puppeteer";
import saveSalesData from "./saveSalesData.js";

export default async function fetchSalesData(courseUrl) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(courseUrl, { waitUntil: "networkidle2" });

    // Espera os seletores essenciais carregarem
    await page.waitForSelector(".enrollment", { timeout: 30000 });
    await page.waitForSelector("h1[data-purpose='lead-title']", {
      timeout: 30000,
    });

    const salesData = await page.evaluate(() => {
      const titleEl = document.querySelector("h1[data-purpose='lead-title']");
      const enrollmentEl = document.querySelector(".enrollment");

      const title = titleEl?.innerText.trim() || "Título não encontrado";
      const enrollmentText = enrollmentEl?.innerText || "0";
      const sales = parseInt(enrollmentText.match(/\d+/g)?.join("") || "0");

      return {
        titleCurrent: title,
        salesCurrent: sales,
        timestamp: new Date().toLocaleString(),
      };
    });

    await browser.close();

    console.log("Dados coletados:", salesData);
    saveSalesData(salesData);
  } catch (error) {
    console.error("Erro ao buscar os seletores:", error);
    await page.screenshot({ path: "error_screenshot.png" });
    await browser.close();
  }
}
