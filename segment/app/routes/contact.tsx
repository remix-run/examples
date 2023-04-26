import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { type SyntheticEvent } from "react";

import * as segment from "~/utils/segment.client";

export const action = async () => json({});

export default function Contact() {
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & {
      message: { value: string };
    };

    console.log(`message: '${target.message.value}'`);

    // The event is using `track` to keep it as simple as posible.
    // It could use `trackForm` instead. See: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#track-form
    segment.track("Form Submitted", {
      message: target.message.value,
    });
  };

  return (
    <main>
      <h1>This is the Contact page</h1>
      <Form onSubmit={handleSubmit} replace={false} id="contact-us">
        <label>
          <span>Message:</span>
          <textarea name="message" />
        </label>
        <button type="submit">submit</button>
      </Form>
    </main>
  );
}
