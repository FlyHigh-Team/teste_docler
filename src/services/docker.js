const Docker = require("dockerode");

const docker = new Docker({
  socketPath: "/var/run/docker.sock"
});

async function listContainers() {
  return docker.listContainers({ all: true });
}

async function createBotContainer(name) {
  const container = await docker.createContainer({
    name,
    Image: "node:18",
    Cmd: ["node", "index.js"],
    WorkingDir: "/app",
    HostConfig: {
      Binds: [`/data/bots/${name}:/app`],
      RestartPolicy: { Name: "unless-stopped" }
    }
  });

  return container;
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

module.exports = {
  listContainers,
  createBotContainer,
  start,
  stop,
  restart
};
