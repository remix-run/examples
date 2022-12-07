import { json } from "@remix-run/node";

import greetingsQueue from "~/queues/greetings.server";

export const loader = async () => {
  await greetingsQueue.enqueue("Groot");
  return json({});
};

export default function Index() {
  return <p>Check the code. Nothing relevant in the UI.</p>;
}
