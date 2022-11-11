const path = require("path");

const express = require("express");
const compression = require("compression");
const { createRequestHandler } = require("@remix-run/express");

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();

app.use(compression());

app.disable("x-powered-by");

app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

app.use(express.static("public", { maxAge: "1h" }));

app.all(
  "*",
  createRequestHandler({
    build: require(BUILD_DIR),
    mode: process.env.NODE_ENV,
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening: http://localhost:${port}`);
});
