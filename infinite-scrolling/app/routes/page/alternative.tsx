import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVirtual } from "react-virtual";

import { countItems, getItemsPaginated } from "~/utils/backend.server";
import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const LIMIT = 200;

const getPage = (searchParams: URLSearchParams) => ({
  page: Number(searchParams.get("page") || "0"),
});

export const loader = async ({ request }: LoaderArgs) => {
  const { page } = getPage(new URL(request.url).searchParams);
  return json(
    {
      items: await getItemsPaginated({ page, limit: LIMIT }),
      totalItems: await countItems(),
    },
    { headers: { "Cache-Control": "public, max-age=120" } }
  );
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [items, setItems] = useState(data.items);

  const fetcher = useFetcher();

  const page = useRef(0);
  const parentRef = useRef<HTMLDivElement>(null);

  const canFetchMore = items.length < data.totalItems;

  const rowVirtualizer = useVirtual({
    size: data.totalItems,
    parentRef,
    initialRect: { width: 0, height: 800 },
    estimateSize: useCallback(() => 35, []),
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index > items.length - 1 &&
      canFetchMore &&
      fetcher.state === "idle" &&
      page.current < items.length / LIMIT
    ) {
      page.current += 1;
      fetcher.load(`/page/alternative?page=${page.current}`);
    }
  }, [canFetchMore, fetcher, items.length, page, rowVirtualizer.virtualItems]);

  useEffect(() => {
    if (fetcher.data) {
      setItems((prevItems) => [...prevItems, ...fetcher.data.items]);
    }
  }, [fetcher.data]);

  return (
    <main>
      <h1>
        Infinite Scrolling (pages loaded {page.current + 1}/
        {data.totalItems / LIMIT})
      </h1>

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
            const { index } = virtualRow;
            const isLoaderRow = index > items.length - 1;
            const item = items[index];

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
                {isLoaderRow ? (
                  canFetchMore ? (
                    "Loading more..."
                  ) : (
                    "Nothing more to load"
                  )
                ) : (
                  <>
                    <span>{index}</span>
                    <span>{item.value}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
