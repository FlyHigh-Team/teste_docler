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

    const bots = containers
      .filter(c => c.Names.some(n => n.startsWith("/bot_")))
      .map(c => ({
        name: c.Names[0].replace("/bot_", ""),
        state: c.State,
        status: c.Status
      }));

    res.json(bots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* START */
router.post("/:name/start", async (req, res) => {
  try {
    await start(req.params.name);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* STOP */
router.post("/:name/stop", async (req, res) => {
  try {
    await stop(req.params.name);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* RESTART */
router.post("/:name/restart", async (req, res) => {
  try {
    await restart(req.params.name);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
