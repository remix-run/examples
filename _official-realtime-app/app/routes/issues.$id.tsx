import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getIssue } from "~/data";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.id, "Missing issue id");
  const issue = await getIssue(params.id);
  if (!issue) {
    throw json("Issue not found", { status: 404 });
  }
  return json(issue);
};

export const meta: MetaFunction<typeof loader> = ({ data: issue }) => ({
  title: issue?.title || "Not Found",
});

export default function Issue() {
  const issue = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="border shadow-md m-4 p-3 rounded">
      <div
        className="text-xl p-1"
        onBlur={(e) => {
          const title = String(e.currentTarget.textContent).trim();
          if (title !== issue.title.trim()) {
            fetcher.submit(
              { title: String(e.target.textContent) },
              {
                action: `/issues/${issue.id}/update`,
                method: "post",
              }
            );
          }
        }}
        contentEditable
        dangerouslySetInnerHTML={{
          __html: fetcher.submission
            ? (fetcher.submission.formData.get("title") as string)
            : issue.title,
        }}
      />
      <p className="text-gray-400 my-8">
        (That title is content editable and will save on blur)
      </p>
      <button className="border rounded shadow py-1 px-2" type="button">
        (pointless button to focus)
      </button>
    </div>
  );
}
