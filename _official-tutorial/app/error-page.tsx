import { Meta, Links, Link, isRouteErrorResponse } from "@remix-run/react";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">
          <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <i>
                {isRouteErrorResponse(error) ? error.statusText : error.message}
              </i>
            </p>
            <Link to="/">Go Home</Link>
          </div>
        </div>
      </body>
    </html>
  );
}
