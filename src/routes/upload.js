const express = require("express");
const multer = require("multer");
const fs = require("fs");
const unzipper = require("unzipper");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "/tmp" });

/* =====================
   FUNÇÃO DE CÓPIA SEGURA
===================== */
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/* =====================
   UPLOAD ZIP
===================== */
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

    const finalDir = `/data/bots/${botName}`;
    const tmpDir = `/data/tmp/${botName}`;

    fs.mkdirSync(finalDir, { recursive: true });
    fs.mkdirSync(tmpDir, { recursive: true });

    console.log("📦 Extraindo ZIP para", tmpDir);

    fs.createReadStream(req.file.path)
      .pipe(unzipper.Extract({ path: tmpDir }))
      .on("close", () => {
        const files = fs.readdirSync(tmpDir);
        if (files.length === 0) {
          return res.status(400).json({ error: "ZIP vazio" });
        }

        // Se ZIP tiver uma pasta raiz única
        const root =
          files.length === 1
            ? path.join(tmpDir, files[0])
            : tmpDir;

        // 👉 COPIA em vez de RENOMEAR
        copyRecursive(root, finalDir);

        fs.rmSync(tmpDir, { recursive: true, force: true });
        fs.unlinkSync(req.file.path);

        console.log("✅ Upload finalizado:", botName);

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
