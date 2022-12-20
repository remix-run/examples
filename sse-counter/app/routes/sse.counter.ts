import type { LoaderArgs } from "@remix-run/node";
import { eventStream } from "remix-utils";

export function loader({ request }: LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    const interval = setInterval(() => {
      send({
        data: new Date().toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    }, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  });
}
