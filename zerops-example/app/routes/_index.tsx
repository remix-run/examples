import type { MetaFunction } from "@remix-run/node";
import styles from "../styles/main.css?url";
import { Steps } from "~/components/Steps";

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
  return (
    <div className="pt-20 pb-10">
      <div className="text-center">
        <span className="border border-dashed border-[#ACC6FF] bg-[#F6F9FF] text-md text-[#5A8DFF] rounded-md px-4 py-2 font-regular">
          Developer-First Platform as a Service
        </span>
        <div>
          <div className="text-8xl font-bold space-y-3 mt-6 mb-10">
            <h1>Say Hello to</h1>
            <h2 className="gradient-text">Remix with Zerops</h2>
          </div>
          <p className="max-w-[800px] mx-auto text-2xl font-medium">
            A Nodejs Remix example for Zerops which you can deploy in 2 simple
            steps (Technically, we don't count Ctrl + V... but who's checking?).
            Scroll down to learn how to deploy.{" "}
          </p>
          <div className="mt-10 flex text-lg flex-row justify-center items-center space-x-5">
            <a href="https://discord.gg/5ptAqtpyvh" target="_blank">
              <button className="primarybutton rounded-md">
                Discord Community
              </button>{" "}
            </a>
            <a href="https://docs.zerops.io/" target="_blank">
              <button className="secondarybutton rounded-md">
                Zerops Docs
              </button>
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-14">
        <Steps />
      </div>
      <p className="text-center mt-10 text-[#939393]">
        Powered by{" "}
        <a href="https://zerops.io" target="_blank">
          Zerops
        </a>
      </p>
    </div>
  );
}
