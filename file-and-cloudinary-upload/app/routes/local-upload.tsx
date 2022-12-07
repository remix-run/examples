import type { ActionArgs } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler = composeUploadHandlers(
    createFileUploadHandler({
      directory: "public/uploads",
      maxPartSize: 30000,
    }),
    createMemoryUploadHandler()
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  const image = formData.get("img");
  if (!image || typeof image === "string") {
    return json({ error: "something wrong" });
  }

  return json({ imgSrc: image.name });
};

export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="img" accept="image/*" />
        <button type="submit">upload image</button>
      </Form>
      {data?.error ? <h2>{data.error}</h2> : null}

      {data?.imgSrc ? (
        <>
          <h2>uploaded image</h2>
          <img alt="uploaded" src={data.imgSrc} />
        </>
      ) : null}
    </>
  );
}
