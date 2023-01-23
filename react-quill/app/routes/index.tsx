import { json } from "@remix-run/node";
import type { ActionArgs, LinksFunction } from '@remix-run/node';
import { Form } from "@remix-run/react";
import { useState } from "react";
import stylesheetQuill from "react-quill/dist/quill.snow.css";
import { ClientOnly } from "remix-utils";

import { FallbackComponent } from "~/components/fallback-component";
import { TextEditor } from "~/components/textEditor.client";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheetQuill }];
}

export const action = async ({ request }: ActionArgs)  => {
  const form = await request.formData();
  const textEditorValue = form.get("textEditor");
  return json({textEditorValue});
};

export default function Index() {
  const [textEditor, setTextEditor] = useState("");
  return (
    <Form method="post">
      <ClientOnly fallback={<FallbackComponent />}>
        {() => (
          <TextEditor
            theme="snow"
            placeholder="Write description"
            onChange={setTextEditor}
            value={textEditor}
          />
        )}
      </ClientOnly>
      <input
        type="hidden"
        name="textEditor"
        value={textEditor}
      />
      <br />
      <button type="submit">Submit</button>
    </Form>
  );
}
