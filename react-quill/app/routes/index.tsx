import { useState } from "react";
import { Form } from "@remix-run/react";
import { ActionFunction } from "@remix-run/node";
import { ClientOnly } from "~/components/client-only";
import { TextEditor } from "~/components/textEditor.client";

import stylesheetQuill from "react-quill/dist/quill.snow.css";

export function links() {
  return [{ rel: "stylesheet", href: stylesheetQuill }];
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const textEditorValue = form.get("textEditor");
  console.log(textEditorValue, "✅ Editor value is available to our server");
  return "";
};

export default function Index() {
  const [textEditor, setTextEditor] = useState<string>("");
  return (
    <Form method="post">
      <ClientOnly>
        {() => (
          <TextEditor
            theme="snow"
            placeholder="Write descrition"
            onChange={setTextEditor}
            value={textEditor}
          />
        )}
      </ClientOnly>
      <input
        type="hidden"
        name="textEditor"
        value={JSON.stringify(textEditor)}
      />
      <br />
      <button type="submit">Submit</button>
    </Form>
  );
}
