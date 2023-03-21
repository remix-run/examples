const express = require("express");
const { createRequestHandler } = require("@remix-run/express");

const build = require("./build/index.js");

const app = express();
app.use(express.static("public"));
app.all(
  "*",
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
  })
);
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on http://localhost:3000");
});
