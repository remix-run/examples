import { Link } from "@remix-run/react";

// import the pixel client helper
import * as pixel from "../utils/pixel.client";

export default function Index() {

  const handleCustomtEvent = () => {
    // define your own event name first 
    // in the facebook event manager dashboard
    pixel.trackCustom("MyCustomEvent", {
      content_name: "Contact Form",
      content_category: "Form",
      contents: [{
        email: "some email",
        phone: "some phone number",
      }],
    }); 

    console.log("custom event fired");
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h2>Example of firing Custom pixel event</h2>
      <h5>Note that you need to define your own event name in the <a target="_blank" href="https://business.facebook.com/events_manager2">Facebook Event Manager</a></h5>
      
      <button 
        type="button"
        onClick={handleCustomtEvent}
      >
        Click Me to fire Custom event
      </button>
      <br />
      <br />
      <Link to="/">Go back</Link>
    </div>
  );
}