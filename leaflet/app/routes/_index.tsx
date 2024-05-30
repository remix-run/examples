import type { LinksFunction } from "@remix-run/node";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import { ClientOnly } from "remix-utils/client-only";

import { Map } from "~/components/map.client";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: leafletStyles,
  },
];

export default function Index() {
  const mapHeight = "400px";

  return (
    <ClientOnly
      fallback={
        <div
          id="skeleton"
          style={{ height: mapHeight, background: "#d1d1d1" }}
        />
      }
    >
      {() => <Map height={mapHeight} />}
    </ClientOnly>
  );
}
