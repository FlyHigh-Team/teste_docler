const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

async function createBotContainer(name) {
  return docker.createContainer({
    name,
    Image: "node:18",
    Cmd: ["node", "index.js"],
    WorkingDir: "/app",
    HostConfig: {
      Binds: [`/data/bots/${name}:/app`],
      RestartPolicy: { Name: "unless-stopped" }
    }
  });
}

async function start(id) {
  return docker.getContainer(id).start();
}
async function stop(id) {
  return docker.getContainer(id).stop();
}
async function restart(id) {
  return docker.getContainer(id).restart();
}

module.exports = { createBotContainer, start, stop, restart };
