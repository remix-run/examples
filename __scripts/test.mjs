#!/usr/bin/env node

import os from "node:os";
import path from "node:path";

import PackageJson from "@npmcli/package-json";
import { execa } from "execa";
import fse from "fs-extra";
import PQueue from "p-queue";

const concurrency = os.cpus().length;

console.log({ concurrency });

let installQueue = new PQueue({ concurrency, autoStart: false });
let buildQueue = new PQueue({ concurrency, autoStart: false });
let typecheckQueue = new PQueue({ concurrency, autoStart: false });

const TO_IGNORE = new Set([
  "__scripts",
  ".git",
  ".github",
  ".gitignore",
  "package.json",
  "prettier.config.js",
  "yarn.lock",
]);

const yarnExamples = new Set(["yarn-pnp"]);
const pnpmExamples = new Set([]);

let examples = [];

if (process.env.CI) {
  const { stderr, stdout, exitCode } = await execa(
    "git",
    ["--no-pager", "diff", "--name-only", "HEAD~1"],
    { cwd: process.cwd() }
  );

  if (exitCode !== 0) {
    console.error(stderr);
    process.exit(exitCode);
  }

  const files = stdout.split("\n");
  const dirs = files.map((f) => f.split("/").at(0));
  examples = [...new Set(dirs)].filter((d) => !TO_IGNORE.has(d));
} else {
  const entries = await fse.readdir(process.cwd(), { withFileTypes: true });
  examples = entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !TO_IGNORE.has(entry.name))
    .map((entry) => entry.name)
    .filter((entry) => fse.existsSync(path.join(entry, "package.json")));
}

const list = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

console.log(`Testing changed examples: ${list.format(examples)}`);

for (const example of examples) {
  const pkgJson = await PackageJson.load(example);

  /** @type {import('execa').Options} */
  const options = { cwd: example, reject: false };

  const pm = pnpmExamples.has(example)
    ? "pnpm"
    : yarnExamples.has(example)
    ? "yarn"
    : "npm";

  installQueue.add(async () => {
    const hasSetup = !!pkgJson.content.scripts?.__setup;

    if (hasSetup) {
      console.log("🔧\u00A0Running setup script for", example);
      const setupResult = await execa(pm, ["run", "__setup"], options);
      if (setupResult.exitCode) {
        console.error(setupResult.stderr);
        throw new Error(`Error running setup script for ${example}`);
      }
    }

    console.log(`📥\u00A0Installing ${example} with "${pm}"`);
    let installResult = await execa(
      pm,
      pm === "npm"
        ? ["install", "--silent", "--legacy-peer-deps"]
        : ["install", "--silent"],
      options
    );

    if (installResult.exitCode) {
      console.error(installResult.stderr);
      throw new Error(`Error installing ${example}`);
    }

    const hasPrisma = fse.existsSync(
      path.join(example, "prisma", "schema.prisma")
    );

    if (hasPrisma) {
      console.log("Generating prisma types for", example);
      const prismaGenerateCommand = await execa(
        "npx",
        ["prisma", "generate"],
        options
      );

      if (prismaGenerateCommand.exitCode) {
        console.error(prismaGenerateCommand.stderr);
        throw new Error(`Error generating prisma types for ${example}`);
      }
    }
  });

  buildQueue.add(async () => {
    console.log(`📦\u00A0Building ${example}`);
    const buildResult = await execa(pm, ["run", "build"], options);

    if (buildResult.exitCode) {
      console.error(buildResult.stderr);
      throw new Error(`Error building ${example}`);
    }
  });

  typecheckQueue.add(async () => {
    console.log(`🕵️\u00A0Typechecking ${example}`);
    const typecheckResult = await execa(pm, ["run", "typecheck"], options);

    if (typecheckResult.exitCode) {
      console.error(typecheckResult.stderr);
      throw new Error(`Error typechecking ${example}`);
    }
  });
}

installQueue.start();

installQueue.on("empty", () => {
  console.log(`installQueue is complete, moving on to buildQueue`);
  return buildQueue.start();
});

buildQueue.on("empty", () => {
  console.log(`buildQueue is complete, moving on to typecheckQueue`);
  return typecheckQueue.start();
});

installQueue.on("error", (error) => console.error("🚨", error));
buildQueue.on("error", (error) => console.error("🚨", error));
typecheckQueue.on("error", (error) => console.error("🚨", error));
