#!/usr/bin/env node

import path from "node:path";
import os from "node:os";

import { execa } from "execa";
import { detect, getCommand } from "@antfu/ni";
import fse from "fs-extra";
import PQueue from "p-queue";
import PackageJson from "@npmcli/package-json";

console.log({ concurrency: os.cpus().length });

const queue = new PQueue({ concurrency: os.cpus().length, autoStart: false });

const TO_IGNORE = [".git", ".github", "__scripts", "yarn.lock", "package.json"];

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

  examples = [...new Set(dirs)].filter((d) => !TO_IGNORE.includes(d));
} else {
  const entries = await fse.readdir(process.cwd(), { withFileTypes: true });
  examples = entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !TO_IGNORE.includes(entry.name))
    .map((entry) => entry.name)
    .filter((entry) => fse.existsSync(path.join(entry, "package.json")));
}

const list = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

console.log(`Testing changed examples: ${list.format(examples)}`);

for (const example of examples) {
  queue.add(async () => {
    const pkgJson = await PackageJson.load(example);

    // TODO: figure out why this is blowing up
    pkgJson.update({
      dependencies: {
        ...pkgJson.content.dependencies,
        "@vanilla-extract/css": "1.9.2",
      },
    });

    await pkgJson.save();

    /** @type {import('execa').Options} */
    const options = { cwd: example, reject: false };

    // detect package manager
    const detected = await detect({ cwd: example });

    const hasSetup = !!pkgJson.content.scripts?.__setup;

    if (hasSetup) {
      const setup = await getCommand(detected, "run", ["__setup"]);
      const setupArgs = setup.split(" ").slice(1);
      console.log("🔧 Running setup script for", example);
      const setupResult = await execa(detected, setupArgs, options);
      if (setupResult.exitCode) {
        console.error(setupResult.stderr);
        throw new Error(`Error running setup script for ${example}`);
      }
    }

    const install = await getCommand(detected, "install", [
      "--silent",
      "--legacy-peer-deps",
    ]);
    // this is silly, but is needed in order for execa to work
    const installArgs = install.split(" ").slice(1, -1);
    console.log(`📥 Installing ${example} with "${install}"`);
    const installResult = await execa(detected, installArgs, options);

    if (installResult.exitCode) {
      console.error(installResult.stderr);
      throw new Error(`Error installing ${example}`);
    }

    const hasPrisma = fse.existsSync(
      path.join(example, "prisma", "schema.prisma")
    );

    if (hasPrisma) {
      console.log("Generating prisma types for", example);
      const prismaGenerate = await execa(
        "npx",
        ["prisma", "generate"],
        options
      );

      if (prismaGenerate.exitCode) {
        console.error(prismaGenerate.stderr);
        throw new Error(`Error generating prisma types for ${example}`);
      }
    }

    const build = await getCommand(detected, "run", ["build"]);
    const buildArgs = build.split(" ").slice(1);
    console.log(`📦 Building ${example} with "${build}"`);
    const buildResult = await execa(detected, buildArgs, options);

    if (buildResult.exitCode) {
      console.error(buildResult.stderr);
      throw new Error(`Error building ${example}`);
    }

    const typecheck = await getCommand(detected, "run", ["typecheck"]);
    const typecheckArgs = typecheck.split(" ").slice(1);
    console.log(`🕵️ Typechecking ${example} with "${typecheck}"`);
    const typecheckResult = await execa(detected, typecheckArgs, options);

    if (typecheckResult.exitCode) {
      console.error(typecheckResult.stderr);
      throw new Error(`Error typechecking ${example}`);
    }
  });
}

queue.start();
queue.on("error", (error) => {
  console.error("🚨", error);
});
