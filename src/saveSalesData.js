import fs from "fs";
import path from "path";
import { saveExecutionLog } from "./logger.js";

export default async function saveSalesData(data) {
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
          console.log("---------------------------------------------");
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
  saveExecutionLog();
}
