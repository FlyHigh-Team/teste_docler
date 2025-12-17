const express = require("express");
const fs = require("fs");

const app = express();

if (!fs.existsSync("/data")) {
  fs.mkdirSync("/data", { recursive: true });
}

app.use(express.json());
app.use(express.static("public"));

app.use("/upload", require("./routes/upload"));
app.use("/logs", require("./routes/logs"));
app.use("/bots", require("./routes/bots"));

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Bot Panel</title>
        <style>
          body {
            background: #0f172a;
            color: #e5e7eb;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .box { text-align: center; }
          h1 { color: #38bdf8; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>🚀 Bot Panel</h1>
          <p>Painel rodando com sucesso</p>
        </div>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Painel rodando na porta", PORT);
});
