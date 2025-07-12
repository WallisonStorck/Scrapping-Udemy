import fetchSalesData from "./src/fetchSalesData.js";
import { logger } from "./src/logger.js";

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
  "https://www.udemy.com/course/web-frontend-completo-html-css-javascript-typescript-react-next/",
  "https://www.udemy.com/course/curso-html5-css/",
  "https://www.udemy.com/course/web-completo/",
  "https://www.udemy.com/course/html-css-do-zero-ao-avancado/",
  "https://www.udemy.com/course/html-essencial-desenvolvimento-front-end/",
  "https://www.udemy.com/course/modulo-i-intro-html/",
  "https://www.udemy.com/course/crie-sites-do-zero-html-css-e-javascript-na-pratica/",
  // -------------------- PYTHON --------------------
  "https://www.udemy.com/course/python-3-do-zero-ao-avancado/",
  "https://www.udemy.com/course/programacao-python-do-basico-ao-avancado/",
  "https://www.udemy.com/course/python-desenvolvedor-do-zero-ao-avancado-projetos-praticos/",
  "https://www.udemy.com/course/python-rpa-e-excel-aprenda-automatizar-processos-e-planilhas/",
  "https://www.udemy.com/course/programacao-em-python-do-basico-ao-avancado/",
  "https://www.udemy.com/course/curso-de-programacao-em-python-do-basico-ao-avancado/",
];

async function main() {
  logger("****** Iniciando scrapping... ******");
  for (const url of courseUrls) {
    await fetchSalesData(url);
  }
}

main();
