const Docker = require("dockerode");
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

async function listContainers() {
  return docker.listContainers({ all: true });
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

module.exports = { listContainers, start, stop, restart };
