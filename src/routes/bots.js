const express = require("express");
const router = express.Router();

const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const {
  listContainers,
  createBotContainer,
  start,
  stop,
  restart
} = require("../services/docker");

/* =========================
   LISTAR BOTS
========================= */
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

/* =========================
   START BOT
========================= */
router.post("/:name/start", async (req, res) => {
  const botName = req.params.name;

  try {
    // 🔎 verifica se o container existe
    let container;
    try {
      container = docker.getContainer(`bot_${botName}`);
      await container.inspect();
    } catch {
      // ❗ não existe → cria
      await createBotContainer(botName);
    }

    await start(botName);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   STOP BOT
========================= */
router.post("/:name/stop", async (req, res) => {
  try {
    await stop(req.params.name);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   RESTART BOT
========================= */
router.post("/:name/restart", async (req, res) => {
  try {
    await restart(req.params.name);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
