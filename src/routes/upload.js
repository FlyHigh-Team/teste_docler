const express = require("express");
const multer = require("multer");
const fs = require("fs");
const unzipper = require("unzipper");
const path = require("path");

const router = express.Router();

// Salva ZIP temporariamente
const upload = multer({ dest: "/tmp" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const botName = req.body.name;
    if (!botName) {
      return res.status(400).json({ error: "Nome do bot não informado" });
    }

    const botDir = `/data/bots/${botName}`;
    fs.mkdirSync(botDir, { recursive: true });

    fs.createReadStream(req.file.path)
      .pipe(unzipper.Extract({ path: botDir }))
      .on("close", () => {
        fs.unlinkSync(req.file.path);
        res.json({ success: true, bot: botName });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
