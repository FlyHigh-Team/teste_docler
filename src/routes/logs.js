const express = require("express");
const Docker = require("dockerode");

const router = express.Router();
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

router.get("/:id", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  const container = docker.getContainer(req.params.id);

  const stream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    tail: 100
  });

  stream.on("data", chunk => {
    res.write(`data: ${chunk.toString()}\n\n`);
  });
});

module.exports = router;
