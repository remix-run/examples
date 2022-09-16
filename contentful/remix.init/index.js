const { execSync } = require("child_process");
const spaceImport = require('contentful-import')
const inquirer = require('inquirer');
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const sort = require("sort-package-json");

function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getRandomString(length) {
  return crypto.randomBytes(length).toString("hex");
}

async function main({ rootDirectory }) {
  const README_PATH = path.join(rootDirectory, "README.md");
  const PACKAGE_JSON_PATH = path.join(rootDirectory, "package.json");

  const REPLACER = "contentful-remix-stack";

  const DIR_NAME = path.basename(rootDirectory);
  const SUFFIX = getRandomString(2);
  const APP_NAME = DIR_NAME + "-" + SUFFIX;

  const [readme, packageJson] = await Promise.all([
    fs.readFile(README_PATH, "utf-8"),
    fs.readFile(PACKAGE_JSON_PATH, "utf-8"),
  ]);

  const newReadme = readme.replace(
    new RegExp(escapeRegExp(REPLACER), "g"),
    APP_NAME
  );

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'spaceId',
      message: 'Enter you Contentful Space ID',
      validate(value) {
        if(!value.length >0) {
          return 'Must enter a Space ID'
        }
        return true
      }
    },
    {
      type: 'input',
      name: 'contentDeliveryApiKey',
      message: 'Enter you Content Delivery API Key',
      validate(value) {
        if(!value.length >0) {
          return 'Must enter Content Delivery API Key'
        }
        return true
      }
    },
    {
      type: 'input',
      name: 'contentManagementToken',
      message: 'Enter you Content Management Token',
      validate(value) {
        if(!value.length >0) {
          return 'Must enter Content Management Token'
        }
        return true
      }
    }
  ]);
  console.log('Creating .env file...')
  const ENV_PATH = path.join(__dirname, "..", ".env")
  const newEnv = [
    `# All environment variables will be sourced`,
    `# and made available.`,
    `# Do NOT commit this file to source control`,
    `CONTENTFUL_SPACE_ID='${answers.spaceId}'`,
    `CONTENTFUL_ACCESS_TOKEN='${answers.contentDeliveryApiKey}'`,
  ]
  .filter(Boolean)
  .join('\n')
  // fs.writeFile(file,fileContents, "utf-8")
  // console.log(".env file created")

  const newPackageJson =
    JSON.stringify(
      sort({ ...JSON.parse(packageJson), name: APP_NAME }),
      null,
      2
    ) + "\n";

  console.log(
    `Updating files...`
  );

  await Promise.all([
    fs.writeFile(README_PATH, newReadme),
    fs.writeFile(ENV_PATH, newEnv),
    fs.writeFile(PACKAGE_JSON_PATH, newPackageJson),
  ]);

  console.log(
    `Removing temporary files from disk.`
  );

  await Promise.all([
    fs.rm(path.join(rootDirectory, "LICENSE"))
  ]);

  console.log(
    `Running the setup script to import content model`
  );

  await spaceImport({
    contentFile: `${rootDirectory}/remix.init/contentful/export.json`,
    spaceId: answers.spaceId,
    managementToken: answers.contentManagementToken
  })

  console.log(`✅  Project is ready! Start development with "npm run dev"`);
}

module.exports = main;