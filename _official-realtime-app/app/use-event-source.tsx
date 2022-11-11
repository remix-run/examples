import { useEffect, useState } from "react";

export function useEventSource(href: string) {
  let [data, setData] = useState("");

  useEffect(() => {
    let eventSource = new EventSource(href);
    eventSource.addEventListener("message", handler);

    function handler(event: MessageEvent) {
      setData(event.data || "UNKNOWN_EVENT_DATA");
    }

    return () => {
      eventSource.removeEventListener("message", handler);
      eventSource.close();
    };
  }, [href]);

  return data;
}
