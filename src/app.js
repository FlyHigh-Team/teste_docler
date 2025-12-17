const express = require("express");
const path = require("path");
const fs = require("fs");
const botsRoutes = require("./routes/bots");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/bots", botsRoutes);

// Rota teste
app.get("/", (req, res) => {
  res.send("Bot Panel rodando 🚀");
});


if (!fs.existsSync("/data")) {
  fs.mkdirSync("/data", { recursive: true });
}


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Painel rodando na porta ${PORT}`);
});
