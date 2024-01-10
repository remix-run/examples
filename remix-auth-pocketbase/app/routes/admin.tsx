import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { pb } from "~/pb.client";
import { createSession, getPocketbase, getUser } from "~/pb.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const pb = getPocketbase(request);
  const user = getUser(pb);

  const redirectUrl = "/admin";

  if (!user) {
    return createSession("/", pb);
  }

  let realtime_example = null;

  try {
    realtime_example = await pb.collection("realtime_example").getFullList();
  } catch (_) {}

  return json({ redirectUrl, user, realtime_example });
}

export default function Admin() {
  const loaderData = useLoaderData<typeof loader>();
  const [count, setCount] = useState(
    loaderData.realtime_example?.[0]?.count || 0,
  );

  useEffect(() => {
    pb?.collection("realtime_example").subscribe("*", (data) => {
      setCount(data.record.count);
    });

    return () => {
      pb?.collection("realtime_example").unsubscribe("*");
    };
  }, [setCount]);

  return (
    <div>
      <div>Hello {loaderData.user.name || loaderData.user.email}</div>
      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
        <Link to="/logout" reloadDocument>
          Logout
        </Link>

        <Link to="/">Home</Link>
      </div>

      <div>
        Realtime Data Demo: <span>{count}</span>
      </div>
    </div>
  );
}
