import fs from "fs";
import path from "path";

//Cria a pasta "log" se ela não existir
const logDir = path.resolve("log");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

//Nome do arquivo baseado na data atual
const getLogFilePath = () => {
  const date = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const logFilePath = path.join(logDir, `${date}-log.txt`);

  // Se o arquivo ainda não existir, cria com cabeçalho
  if (!fs.existsSync(logFilePath)) {
    const header =
      `==================================\n` +
      `Log File - ${date}\n` +
      `Created at: ${new Date().toLocaleString()}\n` +
      `==================================\n\n`;
    fs.writeFileSync(logFilePath, header, "utf8");
  }

  return logFilePath;
};

//Função principal de log
export function logger(message) {
  const timestamp = new Date().toLocaleString();
  const fullMessage = `[${timestamp}] ${message}`;

  console.log(fullMessage); //Exibe no terminal
  fs.appendFileSync(getLogFilePath(), fullMessage + "\n", "utf-8");
}
