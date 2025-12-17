const Docker = require("dockerode");

const docker = new Docker({
  socketPath: "/var/run/docker.sock"
});

async function listContainers() {
  return await docker.listContainers({ all: true });
}

async function startContainer(id) {
  const container = docker.getContainer(id);
  await container.start();
}

async function stopContainer(id) {
  const container = docker.getContainer(id);
  await container.stop();
}

async function restartContainer(id) {
  const container = docker.getContainer(id);
  await container.restart();
}

module.exports = {
  listContainers,
  startContainer,
  stopContainer,
  restartContainer
};
