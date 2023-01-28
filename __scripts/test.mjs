#!/usr/bin/env node

import path from "node:path";

import { execa } from "execa";
import { detect, getCommand } from "@antfu/ni";
import PackageJson from "@npmcli/package-json";
import fse from "fs-extra";

const TO_IGNORE = [".github", "__scripts", "yarn.lock", "package.json"];

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
    .filter((d) => !TO_IGNORE.includes(d));
}

const list = new Intl.ListFormat("en", { style: "long", type: "conjunction" });

console.log(`Testing changed examples: ${list.format(examples)}`);

const settled = await Promise.allSettled(
  examples.map(async (example) => {
    const pkgJson = await PackageJson.load(example);

    const remixDeps = Object.keys(pkgJson.content.dependencies).filter((d) => {
      return d.startsWith("@remix-run/");
    });

    const remixDevDeps = Object.keys(pkgJson.content.devDependencies).filter(
      (d) => {
        return d.startsWith("@remix-run/");
      }
    );

    pkgJson.update({
      dependencies: {
        ...pkgJson.content.dependencies,
        ...Object.fromEntries(remixDeps.map((d) => [d, `latest`])),
      },
      devDependencies: {
        ...pkgJson.content.devDependencies,
        ...Object.fromEntries(remixDevDeps.map((d) => [d, `latest`])),
      },
    });

    await pkgJson.save();

    /** @type {import('execa').Options} */
    const options = { cwd: example };

    const detected = await detect({ cwd: example });

    const install = await getCommand(detected, "install", ["--silent"]);
    const installArgs = install.split(" ").slice(1, -1);
    console.log(
      `Installing ${example} with ${detected} ${installArgs.join(" ")}`
    );
    const installResult = await execa(detected, installArgs, options);

    if (installResult.exitCode) {
      console.error(`Error installing ${example}`);
      console.error(installResult.stderr);
      return;
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
        console.error(`Error generating prisma types for ${example}`);
        console.error(prismaGenerate.stderr);
        return;
      }
    }

    const build = await getCommand(detected, "run", ["build"]);
    const buildArgs = build.split(" ").slice(1);
    console.log(`Building ${example} with ${detected} ${buildArgs.join(" ")}`);
    const buildResult = await execa(detected, buildArgs, options);

    if (buildResult.exitCode) {
      console.error(`Error building ${example}`);
      console.error(buildResult.stderr);
      return;
    }

    const typecheck = await getCommand(detected, "run", ["typecheck"]);
    const typecheckArgs = typecheck.split(" ").slice(1);
    console.log(
      `Typechecking ${example} with ${detected} ${typecheckArgs.join(" ")}`
    );
    const typecheckResult = await execa(detected, typecheckArgs, options);

    if (typecheckResult.exitCode) {
      console.error(`Error typechecking ${example}`);
      console.error(typecheckResult.stderr);
      return;
    }

    pkgJson.update({
      dependencies: {
        ...pkgJson.content.dependencies,
        ...Object.fromEntries(remixDeps.map((d) => [d, `*`])),
      },
      devDependencies: {
        ...pkgJson.content.devDependencies,
        ...Object.fromEntries(remixDevDeps.map((d) => [d, `*`])),
      },
    });

    await pkgJson.save();
  })
);

const rejected = settled.filter((s) => s.status === "rejected");
rejected.forEach((s) => console.error(s.reason));
process.exit(rejected.length > 0 ? 1 : 0);
