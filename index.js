import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

console.log("Welcome to Scraping Udemy");

function saveSalesData(data) {
  const sanitizedTitle = data.titleCurrent
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
  const directory = "data";
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  const filePath = path.join(directory, `${sanitizedTitle}_sales_data.json`);

  fs.readFile(filePath, "utf8", (err, jsonData) => {
    let jsonObject = {};

    if (err) {
      if (err.code === "ENOENT") {
        // Cria um JSON caso não exista
        jsonObject = {
          nextID: 2,
          data: [
            {
              id: 1,
              titleCourse: data.titleCurrent,
              salesQuantity: data.salesCurrent,
              timestamp: data.timestamp,
            },
          ],
        };

        fs.writeFile(filePath, JSON.stringify(jsonObject, null, 2), (err) => {
          if (err) {
            console.error("Erro ao escrever o arquivo:", err);
            return;
          }
          console.log(`Arquivo '${filePath}' criado com sucesso!`);
        });
      } else {
        console.error("Erro ao ler o arquivo:", err);
        return;
      }
    } else {
      // Parseando o arquivo e adicionando novos dados
      let salesArray = JSON.parse(jsonData);

      const nextID = salesArray.nextID;
      const lastIndex = salesArray.data.length - 1;

      // Calcula o número de novas vendas
      const newSales =
        data.salesCurrent - salesArray.data[lastIndex].salesQuantity;

      // Calcula o número de dias e horas desde a última conferência
      const lastTimestamp = new Date(salesArray.data[lastIndex].timestamp);
      const currentTimestamp = new Date(data.timestamp);
      const diffTimestamp = currentTimestamp - lastTimestamp;

      // Calcula a diferença em dias e horas
      const diffDays = Math.floor(diffTimestamp / (1000 * 60 * 60 * 24)); // 1000 ms/s, 60 s/min, 60 min/h, 24 h/dia
      const remainingMsAfterDays = diffTimestamp % (1000 * 60 * 60 * 24);
      const diffHours = Math.floor(remainingMsAfterDays / (1000 * 60 * 60)); // 1000 ms/s, 60 s/min, 60 min/h

      salesArray.data.push({
        id: nextID,
        titleCourse: data.titleCurrent,
        salesQuantity: data.salesCurrent,
        timestamp: data.timestamp, // Adiciona a data e hora atuais no formato ISO
        salesAmount: {
          newSales: newSales,
          inDays: diffDays,
          inHours: diffHours,
        },
      });
      salesArray.nextID++;
      jsonObject = salesArray;

      console.log(
        `Curso: ${data.titleCurrent}\nQuantidade de Vendas: ${data.salesCurrent}\nNovas vendas: ${newSales} em ${diffDays} dia(s) e ${diffHours}hr(s) de diferença!`
      );

      // Escreve no JSON os dados
      fs.writeFile(filePath, JSON.stringify(jsonObject, null, 2), (err) => {
        if (err) {
          console.error("Erro ao escrever no arquivo:", err);
        } else {
          console.log(
            `Dados salvos com sucesso em '${sanitizedTitle}_sales_data.json'\n---------------------------------------------`
          );
        }
      });
    }
  });
}

async function fetchSalesData(courseUrl) {
  const browser = await puppeteer.launch({ headless: false }); // Desativando o headless mode
  const page = await browser.newPage();

  await page.goto(courseUrl, { waitUntil: "networkidle2" });

  try {
    // Espera pelos seletores com um tempo de espera aumentado
    await page.waitForSelector(".enrollment", { timeout: 30000 });
    await page.waitForSelector(
      ".ud-heading-xl.clp-lead__title.clp-lead__title--small",
      { timeout: 30000 }
    );

    const salesData = await page.evaluate(() => {
      const salesText = document.querySelector(".enrollment").innerText;
      const salesNumbers = salesText.match(/\d+/g).join(""); // Extrai apenas os números

      const title = document.querySelector(
        ".ud-heading-xl.clp-lead__title.clp-lead__title--small"
      ).innerText;

      return {
        titleCurrent: title,
        salesCurrent: parseInt(salesNumbers),
        timestamp: new Date().toLocaleString(), // Adiciona a data e hora atuais no formato ISO
      };
    });

    await browser.close();

    saveSalesData(salesData);
  } catch (error) {
    console.error("Erro ao buscar os seletores:", error);
    await page.screenshot({ path: "error_screenshot.png" });
    await browser.close();
  }
}

async function fetchMultipleCourses(courseUrls) {
  for (const url of courseUrls) {
    await fetchSalesData(url);
  }
}

const courseUrls = [
  "https://www.udemy.com/course/como-criar-cursos-online-de-sucesso-2020-intermediario",
  "https://www.udemy.com/course/como-criar-cursos-online-de-sucesso-vip-3-cursos-em-1",
  "https://www.udemy.com/course/como-criar-monetizar-e-otimizar-um-canal-no-youtube-do-zero",
  "https://www.udemy.com/course/como-criar-um-curso-na-udemy-unofficial-e-ganhar-em-dollar",
  "https://www.udemy.com/course/como-criar-um-curso-online",
  "https://www.udemy.com/course/como-criar-um-curso-online-do-zero",
  "https://www.udemy.com/course/criar-um-curso-online/",
  "https://www.udemy.com/course/youtube-para-leigos/",
  // -------------------- JAVASCRIPT --------------------
  "https://www.udemy.com/course/aprenda-javascript-em-7-dias",
  "https://www.udemy.com/course/curso-completo-de-javascript-v",
  "https://www.udemy.com/course/curso-de-javascript-moderno-do-basico-ao-avancado",
  "https://www.udemy.com/course/curso-web-design-fundamentos-aprenda-html-css-e-javascript",
  "https://www.udemy.com/course/javascript-completo-2018-do-iniciante-ao-mestre",
  "https://www.udemy.com/course/javascript-do-basico-ao-avancado-com-node-e-projetos",
  // -------------------- REACTJS --------------------
  "https://www.udemy.com/course/curso-reactjs",
  "https://www.udemy.com/course/curso-web",
  "https://www.udemy.com/course/react-do-zero-a-maestria-c-hooks-router-api-projetos",
  "https://www.udemy.com/course/react-redux-pt",
  "https://www.udemy.com/course/curso-de-reactjs-nextjs-completo-do-basico-ao-avancado",
  "https://www.udemy.com/course/curso-do-figma-ao-codigo-o-design-da-interface-web-completo",
  // -------------------- HTML & CSS --------------------
  "https://www.udemy.com/course/curso-html5-css",
  "https://www.udemy.com/course/html-e-css-o-inicio",
  "https://www.udemy.com/course/html-essencial-desenvolvimento-front-end",
  // "https://www.udemy.com/course/web-frontend-completo-html-css-javascript-typescript-react-next/",
  // "https://www.udemy.com/course/curso-html5-css/",
  // "https://www.udemy.com/course/web-completo/",
  // "https://www.udemy.com/course/html-css-do-zero-ao-avancado/",
  // "https://www.udemy.com/course/html-essencial-desenvolvimento-front-end/",
  // "https://www.udemy.com/course/modulo-i-intro-html/",
  // "https://www.udemy.com/course/crie-sites-do-zero-html-css-e-javascript-na-pratica/",
  // -------------------- PYTHON --------------------
  // "https://www.udemy.com/course/python-3-do-zero-ao-avancado/",
  // "https://www.udemy.com/course/programacao-python-do-basico-ao-avancado/",
  // "https://www.udemy.com/course/python-desenvolvedor-do-zero-ao-avancado-projetos-praticos/",
  // "https://www.udemy.com/course/python-rpa-e-excel-aprenda-automatizar-processos-e-planilhas/",
  // "https://www.udemy.com/course/programacao-em-python-do-basico-ao-avancado/",
  // "https://www.udemy.com/course/curso-de-programacao-em-python-do-basico-ao-avancado/",
];

fetchMultipleCourses(courseUrls);
