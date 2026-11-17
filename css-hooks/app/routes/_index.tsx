import { ComponentPropsWithoutRef } from "react";
import hooks from "../css-hooks";

function A(props: Omit<ComponentPropsWithoutRef<"a">, "style">) {
  return (
    <a
      {...props}
      style={hooks({
        color: "#00c",
        hover: {
          color: "#00f",
          textDecoration: "underline"
        },
        active: {
          color: "#c00"
        }
      })} />
  );
}

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix with CSS Hooks</h1>
      <p>
        Everyone insists that you
        {" "}
        <A href="https://stackoverflow.com/questions/1033156/how-can-i-write-ahover-in-inline-css#answer-1033166">
          can't write <code>a:hover</code>
        </A>
        {" "}
        in inline styles, but I just did. 😉
      </p>
      <p>
        Learn more at <A href="https://css-hooks.com/">css-hooks.com</A>.
      </p>
      <p>
        Or, for a detailed explanation, read <em><A href="https://nsaunders.dev/posts/css-madness-to-hooks">From CSS madness to CSS Hooks</A></em>.
      </p>
    </div>
  );
}
