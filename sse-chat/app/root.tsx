import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useEventSource } from "remix-utils";
import { emitter } from "./services/emitter";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function action({ request }: LoaderArgs) {
  let formData = await request.formData();
  let message = formData.get("message");
  emitter.emit("message", message);
  return json({ message });
}

export default function App() {
  let $form = useRef<HTMLFormElement>(null);
  let { key } = useLocation();
  useEffect(
    function clearFormOnSubmit() {
      $form.current?.reset();
    },
    [key]
  );

  let [messages, setMessages] = useState<string[]>([]);
  let lastMessage = useEventSource("/sse/chat");
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
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
