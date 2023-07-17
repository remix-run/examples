import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { useSubscription } from "react-supabase";

import { client } from "~/utils/supabaseClient.server";

export const loader = async () => {
  const { count } = await client
    .from("clicks")
    .select("id", { count: "exact", head: true });
  return json<number>(count);
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  if (formData.get("like")) {
    await client.from("clicks").insert([{}]);
  }
  return json({});
};

const Buttons = () => {
  const count = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  useSubscription(
    () => {
      fetcher.submit(null, { method: "post" });
    },
    { event: "INSERT", table: "clicks" },
  );
  return (
    <>
      <Form method="post">
        <button name="like" value="1" type="submit">
          👍 {count}
        </button>
      </Form>
    </>
  );
};
export default Buttons;
