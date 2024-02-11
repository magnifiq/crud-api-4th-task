/* eslint-disable */
import os from "os";
import dotenv from "dotenv";
import http from "http";
import cluster from "node:cluster";
import createInstanceOfServer from "./server";

dotenv.config();

const numCores = os.cpus().length;
const startingPort = Number(process.env.PORT);

let currentWorkerIndex = 0;
let worker;

if (cluster.isPrimary) {
  for (let i = 0; i < numCores; i += 1) {
    cluster.fork();
  }

  const loadBalancer = http.createServer((req, res) => {
    const proxyReq = http.request(
      {
        host: "localhost",
        port: startingPort + currentWorkerIndex,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        proxyRes.pipe(res);
      }
    );
    req.pipe(proxyReq);
    currentWorkerIndex = (currentWorkerIndex + 1) % numCores;
  });

  loadBalancer.listen(startingPort, () => {
    console.log(`Load balancer started on: ${startingPort}`);
  });
} else {
  let workerId;
  if (cluster.worker) {
    workerId = cluster.worker.id;
  }

  const server = createInstanceOfServer(
    `Request is caught by the worker - ${workerId}`
  );

  server.listen(startingPort + workerId, () => {
    console.log(`Worker is listening port: ${startingPort + workerId}`);
  });
}
