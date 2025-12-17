const express = require("express");
const fs = require("fs");

const app = express();

if (!fs.existsSync("/data")) {
  fs.mkdirSync("/data", { recursive: true });
}

app.use(express.json());
app.use(express.static("public"));
app.use("/bots", require("./routes/bots"));

app.get("/", (req, res) => {
  res.send("Bot Panel rodando 🚀");
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Painel rodando na porta", PORT);
});
