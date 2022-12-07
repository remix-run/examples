import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useTransition } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVirtual } from "react-virtual";

import { getItems } from "~/utils/backend.server";
import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const LIMIT = 200;
const DATA_OVERSCAN = 40;

const getStartLimit = (searchParams: URLSearchParams) => ({
  start: Number(searchParams.get("start") || "0"),
  limit: Number(searchParams.get("limit") || LIMIT.toString()),
});

export const loader = async ({ request }: LoaderArgs) => {
  const { start, limit } = getStartLimit(new URL(request.url).searchParams);
  return json(
    { items: await getItems({ start, limit }) },
    { headers: { "Cache-Control": "public, max-age=120" } }
  );
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [items, setItems] = useState(data.items);

  const transition = useTransition();
  const fetcher = useFetcher();

  const startRef = useRef(0);
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef,
    estimateSize: useCallback(() => 35, []),
    initialRect: { width: 0, height: 800 },
  });

  const [lastVirtualItem] = [...rowVirtualizer.virtualItems].reverse();
  if (!lastVirtualItem) {
    throw new Error("this should never happen");
  }

  let newStart = startRef.current;
  const upperBoundary = startRef.current + LIMIT - DATA_OVERSCAN;

  if (lastVirtualItem.index > upperBoundary) {
    // user is scrolling down. Move the window down
    newStart = startRef.current + LIMIT;
  }

  useEffect(() => {
    if (newStart === startRef.current) return;

    const qs = new URLSearchParams([
      ["start", String(newStart)],
      ["limit", String(LIMIT)],
    ]);
    fetcher.load(`/offset/simple?${qs}`);
    startRef.current = newStart;
  }, [newStart, fetcher]);

  useEffect(() => {
    if (fetcher.data) {
      setItems((prevItems) => [...prevItems, ...fetcher.data.items]);
    }
  }, [fetcher.data]);

  return (
    <main>
      <h1>Simple Infinite Scrolling (offset={startRef.current})</h1>

      <div
        ref={parentRef}
        className="List"
        style={{
          height: `800px`,
          width: `100%`,
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            const item = items[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                className={`list-item ${
                  virtualRow.index % 2 ? "list-item--odd" : "list-item--even"
                }`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <span>{virtualRow.index}</span>
                <span>
                  {item
                    ? item.value
                    : transition.state === "loading"
                    ? "Loading more..."
                    : "Nothing to see here..."}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
