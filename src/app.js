const express = require("express");
const fs = require("fs");

const app = express();

if (!fs.existsSync("/data")) {
  fs.mkdirSync("/data", { recursive: true });
}

app.get("/", (req, res) => {
  res.send("Bot Panel rodando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Painel rodando na porta", PORT);
});
