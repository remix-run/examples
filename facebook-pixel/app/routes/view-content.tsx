import { Link } from "@remix-run/react";

// import the pixel client helper
import * as pixel from "../utils/pixel.client";


export default function Index() {

  const handleFireEvent = () => {
    // fire ViewContent event
    pixel.track("ViewContent");

    console.log("ViewContent event fired");
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h2>Example of firing ViewContent pixel event</h2>
      <button
        type="button"
        onClick={handleFireEvent}
      >
        Click Me to fire ViewContent event
      </button>
      <br />
      <br />
      <Link to="/">Go back</Link>
    </div>
  );
}