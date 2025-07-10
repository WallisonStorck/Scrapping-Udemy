import fetchSalesData from "./src/fetchSalesData.js";

async function fetchMultipleCourses(courseUrls) {
  for (const url of courseUrls) {
    await fetchSalesData(url);
    console.log("fetchMultipleCourses");
  }
}

const courseUrls = [
  "https://www.udemy.com/course/como-criar-cursos-online-de-sucesso-2020-intermediario",
];

async function main() {
  console.log("Welcome to Scraping Udemy");
  await fetchMultipleCourses(courseUrls);
}

main();
