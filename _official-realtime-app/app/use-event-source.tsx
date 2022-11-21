import { useEffect, useState } from "react";

export function useEventSource(href: string) {
  const [data, setData] = useState("");

  useEffect(() => {
    const eventSource = new EventSource(href);
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
