import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import stylesheetQuill from "react-quill/dist/quill.snow.css?url";
import { ClientOnly } from "remix-utils/client-only";

import { FallbackComponent } from "~/components/fallback-component";
import { TextEditor } from "~/components/textEditor.client";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheetQuill },
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const textEditorValue = form.get("textEditor");
  return json({ textEditorValue });
};

export default function Index() {
  const data = useActionData();
  const [textEditor, setTextEditor] = useState("");
  return (
    <Form method="post">
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}
      <ClientOnly fallback={<FallbackComponent />}>
        {() => (
          <TextEditor
            name="editor"
            theme="snow"
            placeholder="Write description"
            onChange={setTextEditor}
            value={textEditor}
          />
        )}
      </ClientOnly>
      <input type="hidden" name="textEditor" value={textEditor} />
      <br />
      <button type="submit">Submit</button>
    </Form>
  );
}
