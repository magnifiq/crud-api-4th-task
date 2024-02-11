/* eslint-disable */
import getHandler from "./handlers/getHandler";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { Content } from "./types_of_data";

export default function createInstanceOfServer(workerMessage?: string) {
  return createServer(
    (req: IncomingMessage & Content, res: ServerResponse) => {
      if (workerMessage) {
        console.log(workerMessage);
      }

      getHandler(req, res).catch((error) => {
        console.error(error);
        res.statusCode = 500;
        res.end(JSON.stringify({ message: "Internal error" }));
      });
    }
  );
}

export const server = createInstanceOfServer();
