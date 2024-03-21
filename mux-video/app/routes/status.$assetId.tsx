import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { useEffect } from "react";
import Link from "~/components/Link";
import mux from "~/lib/mux.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // now that we have an assetId, we can see how the video is doing.
  // in production, you might have some setup where a Mux webhook
  // tells your server the status of your asset.
  // https://docs.mux.com/guides/listen-for-webhooks
  // for this example, however, we'll just ask the Mux API ourselves
  const { assetId } = params;
  if (typeof assetId !== "string") {
    throw new Error("No assetId found");
  }
  const asset = await mux.video.assets.retrieve(assetId);

  // if the asset is ready and it has a public playback ID,
  // (which it should, considering the upload settings we used)
  // redirect to its playback page
  if (asset.status === "ready") {
    const playbackIds = asset.playback_ids;
    if (Array.isArray(playbackIds)) {
      const playbackId = playbackIds.find((id) => id.policy === "public");
      if (playbackId) {
        return redirect(`/playback/${playbackId.id}`);
      }
    }
  }

  // if the asset is not ready, we'll keep polling
  return json({
    status: asset.status,
    errors: asset.errors,
  });
};

export default function UploadStatus() {
  const { status, errors } = useLoaderData<typeof loader>();
  const { assetId } = useParams();
  const fetcher = useFetcher();

  // we'll poll the API by running the loader every two seconds
  useEffect(() => {
    if (status !== "preparing") return;

    const interval = setInterval(() => {
      fetcher.load(`/status/${assetId}`);
    }, 2000);
    return () => clearInterval(interval);
  }, [fetcher, assetId, status]);

  if (status === "preparing") {
    return <p className="animate-pulse font-mono">Asset is preparing...</p>;
  }

  // if not preparing, then "errored" or "ready"
  // if "errored", we'll show the errors
  // we don't expect to see "ready" because "ready" should redirect in the action
  return (
    <>
      <p className="mb-4 font-mono">
        Asset is in an unexpected state: <code>{status}</code>.
      </p>
      {Array.isArray(errors) && (
        <ul className="mb-4 font-mono">
          {errors.map((error, key) => (
            <li key={key}>{JSON.stringify(error)}</li>
          ))}
        </ul>
      )}
      <p className="font-mono">
        This is awkward. Let&apos;s <Link to="/">refresh</Link> and try again.
      </p>
    </>
  );
}
