import fs from "fs";
import path from "path";

const logDir = path.resolve("log");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const timestampStr = new Date().toISOString().replace(/[:.]/g, "-");
const logFile = path.join(logDir, `scraping_log_${timestampStr}.txt`);

let logBuffer = [];
const originalConsoleLog = console.log;

console.log = function (...args) {
  const message = args.join(" ");
  logBuffer.push(message);
  originalConsoleLog(...args);
};

export function saveExecutionLog() {
  const finalLog =
    logBuffer.join("\n") +
    "\n---------------------------------------------\n\n";
  fs.writeFileSync(logFile, finalLog, "utf8");
  originalConsoleLog(`\n[LOG SALVO EM]: ${logFile}`);
}
