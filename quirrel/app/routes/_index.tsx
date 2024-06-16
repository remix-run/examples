import { json } from "@remix-run/node";

import greetingsQueue from "~/queues/greetings.server";

export const loader = async () => {
  await greetingsQueue.enqueue("Groot");
  return null;
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
    </div>
  );
}
