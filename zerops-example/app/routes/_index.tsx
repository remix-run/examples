import type { MetaFunction } from "@remix-run/node";

import { Code } from "~/components/Code";

import styles from "../styles/main.css?url";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix with Zerops" },
    { name: "description", content: "Say hello to remix with zerops!" },
  ];
};

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Index() {
  const Yaml = `project:
  name: zerops-remix

services:
  - hostname: remixnode
    type: nodejs@18
    buildFromGit: https://github.com/fxck/zerops-remix-nodejs
    ports:
      - port: 3000
        httpSupport: true
    enableSubdomainAccess: true
    minContainers: 1`.trim();

  return (
    <div>
      <div>
        <div>
          <h1>Say Hello to Remix with Zerops</h1>
          <h3>Step 1</h3>
          <p>
            Go to{" "}
            <a
              href="https://app.zerops.io/dashboard/projects"
              target="_blank"
              rel="noreferrer"
            >
              Zerops Dashboard
            </a>{" "}
            and Click on the 'Import Project' button on the sidebar.
          </p>
          <h3>Step 2</h3>
          <p>
            Copy the YAML code mentioned below and paste it to import this
            example. Alternatively, you can clone zerops-solid-static to your
            Git Hub profile and then replace the repository URL in the
            buildFromGit parameter.
          </p>
          <Code code={Yaml} />
          <p>
            If you still find yourself stuck in the process join our.
            <a
              href="https://discord.gg/5ptAqtpyvh"
              target="_blank"
              rel="noreferrer"
            >
              Discord community
            </a>
          </p>
        </div>
      </div>
      <p>
        Powered by{" "}
        <a href="https://zerops.io" target="_blank" rel="noreferrer">
          Zerops
        </a>
      </p>
    </div>
  );
}
