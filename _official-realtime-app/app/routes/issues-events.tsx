import { type DataFunctionArgs } from "@remix-run/node";
import { eventStream } from "../event-stream";
import { emitter, EVENTS } from "../events";

export let loader = ({ request }: DataFunctionArgs) => {
  return eventStream(request, send => {
    let handler = (message: string) => {
      send("message", message);
    };

    emitter.addListener(EVENTS.ISSUE_CHANGED, handler);
    return () => {
      emitter.removeListener(EVENTS.ISSUE_CHANGED, handler);
    };
  });
};
