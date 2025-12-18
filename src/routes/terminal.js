const express = require("express");
const Docker = require("dockerode");
const WebSocket = require("ws");

const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const router = express.Router();

router.ws("/:name", async (ws, req) => {
  const container = docker.getContainer(`bot_${req.params.name}`);

  const stream = await container.attach({
    stream: true,
    stdin: true,
    stdout: true,
    stderr: true
  });

  ws.on("message", msg => stream.write(msg));
  stream.on("data", data => ws.send(data.toString()));
});

module.exports = router;
