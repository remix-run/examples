import { useState } from "react";
import { Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionArgs, LinksFunction } from '@remix-run/node';
import stylesheetQuill from "react-quill/dist/quill.snow.css";
import { ClientOnly } from "~/components/client-only";
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
      <ClientOnly>
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
