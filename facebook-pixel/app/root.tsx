import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useLocation,
} from "@remix-run/react";

// import the pixel client helper
import * as pixel from "./utils/pixel.client";
import { useEffect } from "react";

/**
 * put the Your Pixel ID in the loader. 
 * Sure you can also put it in the .env
 * @returns Lets
 */
export let loader = async () => {
  return json({
    PIXEL_ID: 'YOUR_PIXEL_ID_HERE',
  });
};

export function Layout({ children }: { children: React.ReactNode }) {

  const location = useLocation();
  
  // get the pixel id
  const { PIXEL_ID } = useLoaderData<typeof loader>();

  // fire pixel init and the default pageview event here
  // we use location as the depency index. so everytime the route changes, the pixel will fire
  useEffect(() => {
    pixel.init(PIXEL_ID);
    pixel.pageView();
  }, [location, PIXEL_ID]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* 
          Facebook Pixel script injection. lets only activate it on Production only

          You will also notice that I split script injection into 2 parts as seen below. After several atempts and trial, puting it as a single script tag as Facebook suggested did not work. It rise a hydation error in Production.

          You should try it yourself and see it.
        */}
         {process.env.NODE_ENV === "development" ? null : (
          <> 
            <script
              async
              id="fb-pixel"
              dangerouslySetInnerHTML={{
                __html: `!(function(h,a,i,c,j,d,g){if(window.fbq){return}j=window.fbq=function(){j.callMethod?j.callMethod.apply(j,arguments):j.queue.push(arguments)};if(!window._fbq){window._fbq=j}j.push=j;j.loaded=!0;j.version="2.0";j.queue=[]})(window,document);`,
                }}
            />
            <script
              async
              src={`https://connect.facebook.net/en_US/fbevents.js`}
            />
          </>
        )}

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
