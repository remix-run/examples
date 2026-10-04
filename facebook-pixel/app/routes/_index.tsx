import { Link } from "@remix-run/react";
export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Home Page</h1>
      <br />
      <p>
        If you see this page, Pixel should fire <b>PageView</b> event by default
      </p>
      <p>
        And now go to this route for firing another standard event <b>ViewContent</b>
        <br />
        <Link to="/view-content">ViewContent</Link>
      </p>
      <p>
        And this route for firing a custom event
        <br />
        <Link to="/custom-event">CustomEvent</Link>
      </p>
    </div>
  );
}
