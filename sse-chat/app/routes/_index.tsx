import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useEventSource } from "remix-utils";

import { emitter } from "~/services/emitter";

export async function action({ request }: LoaderArgs) {
  const formData = await request.formData();
  const message = formData.get("message");
  emitter.emit("message", message);
  return json({ message });
}

export default function Component() {
  const $form = useRef<HTMLFormElement>(null);
  const { key } = useLocation();
  useEffect(
    function clearFormOnSubmit() {
      $form.current?.reset();
    },
    [key]
  );

  const [messages, setMessages] = useState<string[]>([]);
  const lastMessage = useEventSource("/sse/chat");
  useEffect(
    function saveMessage() {
      setMessages((current) => {
        if (typeof lastMessage === "string") return current.concat(lastMessage);
        return current;
      });
    },
    [lastMessage]
  );

  return (
    <>
      <Form ref={$form} method="post">
        <label>Message</label>
        <input type="text" name="message" />
        <button>Send</button>
      </Form>

      <ul>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </>
  );
}
