const fs = require("fs");
const path = require("path");

function detectRuntime(botPath) {
  const files = fs.readdirSync(botPath);

  if (files.includes("tsconfig.json")) {
    return { type: "ts", start: "npm run build && node dist/index.js" };
  }

  if (files.includes("package.json")) {
    return { type: "node", start: "npm install && node index.js" };
  }

  if (files.includes("requirements.txt")) {
    return { type: "python", start: "pip install -r requirements.txt && python main.py" };
  }

  if (files.some(f => f.endsWith(".py"))) {
    return { type: "python", start: "python main.py" };
  }

  return null;
}

module.exports = detectRuntime;
