import type { LoaderArgs } from "@remix-run/node";
import { eventStream } from "remix-utils";

import { emitter, EVENTS } from "~/events";

export const loader = async ({ request }: LoaderArgs) => {
  return eventStream(request.signal, (send) => {
    const handler = (message: string) => {
      send({ data: message });
    };

    emitter.addListener(EVENTS.ISSUE_CHANGED, handler);
    return () => {
      emitter.removeListener(EVENTS.ISSUE_CHANGED, handler);
    };
  });
};
