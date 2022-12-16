#!/usr/bin/env node

import path from "node:path";

import { execa } from "execa";
import { detect, getCommand } from "@antfu/ni";
import PackageJson from "@npmcli/package-json";
import fse from "fs-extra";

const TO_IGNORE = [".github", "scripts", "yarn.lock", "package.json"];

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

const examples = [...new Set(dirs)].filter((d) => !TO_IGNORE.includes(d));

const settled = await Promise.allSettled(
  examples.map(async (example) => {
    const pkgJson = await PackageJson.load(example);

    /** @type {import('execa').Options} */
    const options = { cwd: example };

    const detected = await detect({ cwd: example });

    const install = await getCommand(detected, "install", ["--silent"]);
    const installArgs = install.split(" ").slice(1, -1);
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
    const buildResult = await execa(detected, buildArgs, options);

    if (buildResult.exitCode) {
      console.error(`Error building ${example}`);
      console.error(buildResult.stderr);
      return;
    }

    if (!("typecheck" in pkgJson.content.scripts)) {
      pkgJson.update({
        scripts: {
          ...pkgJson.content.scripts,
          typecheck: "tsc --skipLibCheck",
        },
      });

      await pkgJson.save();
    }

    const typecheck = await getCommand(detected, "run", ["typecheck"]);
    const typecheckArgs = typecheck.split(" ").slice(1);
    const typecheckResult = await execa(detected, typecheckArgs, options);

    if (typecheckResult.exitCode) {
      console.error(`Error typechecking ${example}`);
      console.error(typecheckResult.stderr);
      return;
    }
  })
);

const rejected = settled.filter((s) => s.status === "rejected");
rejected.forEach((s) => console.error(s.reason));
process.exit(rejected.length > 0 ? 1 : 0);
