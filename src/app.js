const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

/* =====================
   GARANTIR PASTAS BASE
===================== */
const baseData = "/data";
const botsDir = "/data/bots";
const tmpDir = "/data/tmp";

[baseData, botsDir, tmpDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/* =====================
   MIDDLEWARES
===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

/* =====================
   ROTAS DE API
===================== */
app.use("/upload", require("./routes/upload"));
app.use("/logs", require("./routes/logs"));
app.use("/bots", require("./routes/bots"));

/* =====================
   ROTAS DE PÁGINAS
===================== */

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Página individual do bot
app.get("/bot/:name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/bot.html"));
});

const expressWs = require("express-ws")(app);
app.use("/terminal", require("./routes/terminal"));


/* =====================
   START SERVER
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Bot Panel rodando na porta", PORT);
});
