const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  listContainers,
  startContainer,
  stopContainer,
  restartContainer
} = require("../services/docker");

const router = express.Router();

/* =====================
   LISTAR BOTS
===================== */
router.get("/", async (req, res) => {
  try {
    const containers = await listContainers();
    res.json(containers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================
   START
===================== */
router.post("/:id/start", async (req, res) => {
  try {
    await startContainer(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================
   STOP
===================== */
router.post("/:id/stop", async (req, res) => {
  try {
    await stopContainer(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================
   RESTART
===================== */
router.post("/:id/restart", async (req, res) => {
  try {
    await restartContainer(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================
   UPLOAD DE ARQUIVOS
===================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const botPath = `/data/bots/${req.params.bot}`;
    fs.mkdirSync(botPath, { recursive: true });
    cb(null, botPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

router.post("/upload/:bot", upload.single("file"), (req, res) => {
  res.json({ success: true, file: req.file.originalname });
});

module.exports = router;
