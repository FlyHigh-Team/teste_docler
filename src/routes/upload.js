const express = require("express");
const multer = require("multer");
const fs = require("fs");
const unzipper = require("unzipper");
const path = require("path");

const router = express.Router();

// upload temporário
const upload = multer({ dest: "/tmp" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("📤 Upload recebido");

    if (!req.file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    const botName = req.body.name;
    if (!botName) {
      return res.status(400).json({ error: "Nome do bot não informado" });
    }

    const baseDir = `/data/bots/${botName}`;
    const tmpDir = `/data/tmp/${botName}`;

    fs.mkdirSync(baseDir, { recursive: true });
    fs.mkdirSync(tmpDir, { recursive: true });

    console.log("📦 Extraindo ZIP para", tmpDir);

    fs.createReadStream(req.file.path)
      .pipe(unzipper.Extract({ path: tmpDir }))
      .on("close", () => {
        const files = fs.readdirSync(tmpDir);

        if (files.length === 0) {
          return res.status(400).json({ error: "ZIP vazio" });
        }

        const innerPath =
          files.length === 1
            ? path.join(tmpDir, files[0])
            : tmpDir;

        fs.readdirSync(innerPath).forEach(file => {
          fs.renameSync(
            path.join(innerPath, file),
            path.join(baseDir, file)
          );
        });

        fs.rmSync(tmpDir, { recursive: true, force: true });
        fs.unlinkSync(req.file.path);

        console.log("✅ Upload concluído:", botName);

        res.json({
          success: true,
          redirect: `/bot/${botName}`
        });
      });

  } catch (err) {
    console.error("❌ ERRO NO UPLOAD:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
