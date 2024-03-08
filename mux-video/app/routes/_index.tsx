import MuxUploader from "@mux/mux-uploader-react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import mux from "~/lib/mux.server";

export const loader = async () => {
  // Create an endpoint for MuxUploader to upload to
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ["public"],
      encoding_tier: "baseline",
    },
    // in production, you'll want to change this origin to your-domain.com
    cors_origin: "*",
  });
  return json({ id: upload.id, url: upload.url });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const uploadId = formData.get("uploadId");
  if (typeof uploadId !== "string") {
    throw new Error("No uploadId found");
  }

  // when the upload is complete,
  // the upload will have an assetId associated with it
  // we'll use that assetId to view the video status
  const upload = await mux.video.uploads.retrieve(uploadId);
  if (upload.asset_id) {
    return redirect(`/status/${upload.asset_id}`);
  }

  // while onSuccess is a strong indicator that Mux has received the file
  // and created the asset, this isn't a guarantee.
  // In production, you might write an api route
  // to listen for the`video.upload.asset_created` webhook
  // https://docs.mux.com/guides/listen-for-webhooks
  // However, to keep things simple here,
  // we'll just ask the user to push the button again.
  // This should rarely happen.
  return json({ message: "Upload has no asset yet. Try again." });
};

export default function UploadPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

  const { id, url } = loaderData;
  const { message } = actionData ?? {};

  return (
    <Form method="post">
      <MuxUploader endpoint={url} onSuccess={() => setIsUploadSuccess(true)} />
      <input type="hidden" name="uploadId" value={id} />
      {/* 
        you might have other fields here, like name and description,
        that you'll save in your CMS alongside the uploadId and assetId
      */}
      <button
        type="submit"
        className="my-4 p-4 py-2 rounded border border-blue-600 text-blue-600 disabled:border-gray-400 disabled:text-gray-400"
        disabled={!isUploadSuccess}
      >
        {isUploadSuccess ? "Watch video" : "Waiting for upload..."}
      </button>
      {message && <p>{message}</p>}
    </Form>
  );
}
