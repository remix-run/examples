import { type DataFunctionArgs } from "@remix-run/node";

import { eventStream } from "../event-stream";
import { emitter, EVENTS } from "../events";

export const loader = ({ request }: DataFunctionArgs) => {
  return eventStream(request, (send) => {
    const handler = (message: string) => {
      send("message", message);
    };

    emitter.addListener(EVENTS.ISSUE_CHANGED, handler);
    return () => {
      emitter.removeListener(EVENTS.ISSUE_CHANGED, handler);
    };
  });
};
