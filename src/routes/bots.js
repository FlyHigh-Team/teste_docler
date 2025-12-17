const express = require("express");
const router = express.Router();

const {
  listContainers,
  start,
  stop,
  restart
} = require("../services/docker");

/* LISTAR BOTS */
router.get("/", async (req, res) => {
  try {
    const containers = await listContainers();
    res.json(containers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* START */
router.post("/:id/start", async (req, res) => {
  await start(req.params.id);
  res.json({ success: true });
});

/* STOP */
router.post("/:id/stop", async (req, res) => {
  await stop(req.params.id);
  res.json({ success: true });
});

/* RESTART */
router.post("/:id/restart", async (req, res) => {
  await restart(req.params.id);
  res.json({ success: true });
});

module.exports = router;
