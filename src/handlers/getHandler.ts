import routers from "../routers";
import url from "node:url";
import { IncomingMessage, ServerResponse } from "http";
import { ClientSchema, Content } from "../types_of_data";

function parseContent(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on("data", (chunk: Buffer) => {
      if (chunk) {
        chunks.push(chunk);
      }
    });

    req.on("end", () => {
      let body;

      try {
        body = JSON.parse(Buffer.concat(chunks).toString());
      } catch (error) {
        console.error("Failed to parse body");
        resolve(undefined);
      }

      resolve(body);
    });
  });
}

function setHeaders(res: ServerResponse): typeof res {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  return res;
}

function parseUrl(urlString: string | undefined): [string, string] {
  let route = "";
  let possibleUrlParam = "";

  if (urlString) {
    const parsedUrl = url.parse(urlString, true);
    let sanitizedUrl = parsedUrl.pathname as string;
    sanitizedUrl = sanitizedUrl.replace(/^\/+|\/+$/g, "");

    Object.keys(routers).forEach((existingRoute) => {
      if (new RegExp(`^${existingRoute}`).test(sanitizedUrl)) {
        route = existingRoute;
      }
    });

    possibleUrlParam = sanitizedUrl
      .replace(route, "")
      .replace(/^\/+|\/+$/g, "");
  }

  return [route, possibleUrlParam];
}

export default async function getHandler(
  req: IncomingMessage & Content,
  res: ServerResponse
) {
  const [route, urlParam] = parseUrl(req.url);

  if (!route) {
    return routers.notExist(req, res);
  }

  req.params = { id: urlParam };

  setHeaders(res);

  switch (req.method?.toLowerCase()) {
    case "get":
      routers[route].get(req, res);
      break;
    case "post":
      req.body = (await parseContent(req)) as ClientSchema;
      routers[route].post(req, res);
      break;
    case "put":
      req.body = (await parseContent(req)) as ClientSchema;
      routers[route].put(req, res);
      break;
    case "delete":
      routers[route].delete(req, res);
      break;
    default:
      return routers.notExist(req, res);
  }
  return "";
}