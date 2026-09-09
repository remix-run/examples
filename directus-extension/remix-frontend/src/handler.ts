import { createRequestHandler } from "@remix-run/express";
import * as path from "node:path";
import serveStatic from "serve-static";
import * as fs from "node:fs";
import * as url from "node:url";
import { broadcastDevReady } from "@remix-run/node";
import type { Router } from "express";
import type { EndpointExtensionContext } from "@directus/types";

/** @typedef {import('@remix-run/node').ServerBuild} ServerBuild */

const BUILD_PATH = path.resolve("./build/index.js");
const VERSION_PATH = path.resolve("./build/version.txt");
let initialBuild = await reimportServer();

const __dirname = process.cwd();

const serve = serveStatic(path.resolve(__dirname, "public"), {
  maxAge: "1h",
});
const serveBuild = serveStatic(path.resolve(__dirname, "public/build"), {
  maxAge: "1y",
  immutable: true,
});

function getLoadContext(context: EndpointExtensionContext) {
  return (req: any) => {
    return {
      ...context,
      schema: req.schema,
      accountability: req.accountability,
    };
  };
}

export async function handler(
  router: Router,
  context: EndpointExtensionContext
) {
  const requestHandler =
    process.env.REMIX_ENV === "development"
      ? createDevRequestHandler(initialBuild, context)
      : createRequestHandler({
          build: initialBuild,
          getLoadContext: getLoadContext(context),
        });
  router.all("*", (req, res, next) => {
    // Handling for Directus URLs
    if (req.url.startsWith("/auth/login") || req.url.startsWith("/admin")) {
      return next();
    }
    serveBuild(req, res, () => {
      serve(req, res, () => {
        requestHandler(req, res, next);
      });
    });
  });
}

/**
 * @returns {Promise<ServerBuild>}
 */
export async function reimportServer() {
  const stat = fs.statSync(BUILD_PATH);

  // convert build path to URL for Windows compatibility with dynamic `import`
  const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

  // use a timestamp query parameter to bust the import cache
  return import(BUILD_URL + "?t=" + stat.mtimeMs);
}

/**
 * @param {ServerBuild} initialBuild
 */
function createDevRequestHandler(
  b: typeof initialBuild,
  context: EndpointExtensionContext
) {
  let build = b;
  async function handleServerUpdate() {
    // 1. re-import the server build
    build = await reimportServer();
    // 2. tell Remix that this app server is now up-to-date and ready
    broadcastDevReady(build);
  }

  fs.watch(VERSION_PATH, handleServerUpdate);
  // wrap request handler to make sure its recreated with the latest build for every request
  return async (req: any, res: any, next: any) => {
    try {
      return createRequestHandler({
        build,
        mode: "development",
        getLoadContext: getLoadContext(context),
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
