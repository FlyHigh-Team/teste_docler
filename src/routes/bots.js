const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const docker = require("../services/docker");

const router = express.Router();

/* LISTAR CONTAINERS */
router.get("/", async (req, res) => {
  const containers = await docker.listContainers();
  res.json(containers);
});

/* START */
router.post("/:id/start", async (req, res) => {
  await docker.start(req.params.id);
  res.json({ success: true });
});

/* STOP */
router.post("/:id/stop", async (req, res) => {
  await docker.stop(req.params.id);
  res.json({ success: true });
});

/* RESTART */
router.post("/:id/restart", async (req, res) => {
  await docker.restart(req.params.id);
  res.json({ success: true });
});

/* UPLOAD DE ARQUIVOS */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/data/bots/${req.params.bot}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

router.post("/upload/:bot", upload.single("file"), (req, res) => {
  res.json({ success: true });
});

module.exports = router;
