import type { ActionArgs, UploadHandler } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { uploadImage } from "~/utils/utils.server";

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }

      const uploadedImage = await uploadImage(data);
      return uploadedImage.secure_url;
    },
    createMemoryUploadHandler()
  );

  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgSrc = formData.get("img");
  const imgDesc = formData.get("desc");
  if (!imgSrc) {
    return json({ error: "something wrong" });
  }

  return json({ imgDesc, imgSrc });
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <>
      <Form method="post" encType="multipart/form-data">
        <label htmlFor="img-field">Image to upload</label>
        <input id="img-field" type="file" name="img" accept="image/*" />
        <label htmlFor="img-desc">Image description</label>
        <input id="img-desc" type="text" name="desc" />
        <button type="submit">upload to cloudinary</button>
      </Form>
      {actionData && "error" in actionData ? <h2>{actionData.error}</h2> : null}

      {actionData && "imgSrc" in actionData ? (
        <>
          <h2>uploaded image</h2>
          <img
            src={actionData.imgSrc}
            alt={actionData.imgDesc || "Upload result"}
          />
        </>
      ) : null}
    </>
  );
}
