const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");

const docker = new Docker({
  socketPath: "/var/run/docker.sock"
});

/* =========================
   DETECTAR RUNTIME DO BOT
========================= */
function detectRuntime(botPath) {
  const files = fs.readdirSync(botPath);

  // TypeScript
  if (files.includes("tsconfig.json")) {
    return {
      type: "ts",
      image: "node:18",
      cmd: "npm install && npm run build && node dist/index.js"
    };
  }

  // Node.js
  if (files.includes("package.json")) {
    return {
      type: "node",
      image: "node:18",
      cmd: "npm install && node index.js"
    };
  }

  // Python com requirements
  if (files.includes("requirements.txt")) {
    return {
      type: "python",
      image: "python:3.11",
      cmd: "pip install -r requirements.txt && python main.py"
    };
  }

  // Python simples
  const pyFile = files.find(f => f.endsWith(".py"));
  if (pyFile) {
    return {
      type: "python",
      image: "python:3.11",
      cmd: `python ${pyFile}`
    };
  }

  throw new Error("❌ Runtime do bot não identificado");
}

/* =========================
   LISTAR CONTAINERS
========================= */
async function listContainers() {
  return docker.listContainers({ all: true });
}

/* =========================
   CRIAR CONTAINER
========================= */
async function createBotContainer(botName) {
  const botPath = `/data/bots/${botName}`;

  if (!fs.existsSync(botPath)) {
    throw new Error("❌ Pasta do bot não existe");
  }

  const runtime = detectRuntime(botPath);

  const container = await docker.createContainer({
    name: `bot_${botName}`,
    Image: runtime.image,
    Cmd: ["sh", "-c", runtime.cmd],
    WorkingDir: "/app",
    Tty: true,
    OpenStdin: true,
    HostConfig: {
      Binds: [`${botPath}:/app`],
      RestartPolicy: { Name: "unless-stopped" }
    }
  });

  return container;
}

/* =========================
   PEGAR OU CRIAR CONTAINER
========================= */
async function getOrCreateContainer(botName) {
  const containerName = `bot_${botName}`;

  try {
    const container = docker.getContainer(containerName);
    await container.inspect();
    return container;
  } catch {
    return await createBotContainer(botName);
  }
}

/* =========================
   START / STOP / RESTART
========================= */
async function start(botName) {
  const container = await getOrCreateContainer(botName);
  return container.start();
}

async function stop(botName) {
  const container = await getOrCreateContainer(botName);
  return container.stop();
}

async function restart(botName) {
  const container = await getOrCreateContainer(botName);
  return container.restart();
}

/* =========================
   EXECUTAR COMANDO (TERMINAL)
========================= */
async function execCommand(botName, command) {
  const container = await getOrCreateContainer(botName);

  const exec = await container.exec({
    Cmd: ["sh", "-c", command],
    AttachStdout: true,
    AttachStderr: true
  });

  return new Promise((resolve, reject) => {
    exec.start((err, stream) => {
      if (err) return reject(err);

      let output = "";
      stream.on("data", chunk => (output += chunk.toString()));
      stream.on("end", () => resolve(output));
    });
  });
}

module.exports = {
  listContainers,
  createBotContainer,
  getOrCreateContainer,
  start,
  stop,
  restart,
  execCommand
};
