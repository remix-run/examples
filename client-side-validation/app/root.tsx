import type { ActionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useActionData,
  useLoaderData,
} from "@remix-run/react";

import stylesUrl from "~/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const message = `Successfully submitted data:
      - Required text: ${form.get("required-text")}
      - Required checkbox: ${form.get("required-checkbox")}
      - Text with regex: ${form.get("text-with-regex")} 
      - Number with min max: ${form.get("number-with-min-max")}
      - Text with minlength maxlength: ${form.get(
        "text-with-minlength-maxlength",
      )}
      - Date with min max: ${form.get("date-with-min-max")}
  `;
  return json({ message }, { status: 200 });
};

export const loader = async () => {
  const date = new Date();

  // today string in "YYYY-MM-DD" format
  const todayString = `${date.getFullYear()}-${(
    "00" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("00" + date.getDate()).slice(-2)}`;

  // tomorrow string in "YYYY-MM-DD" format
  const tomorrowString = `${date.getFullYear()}-${(
    "00" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("00" + (date.getDate() + 1)).slice(-2)}`;

  return json({ todayString, tomorrowString });
};

export default function App() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="root">
          <h1>Client-Side Validation Example</h1>
          <form method="post">
            <div className="form-control">
              <label>
                Required text
                <abbr title="This field is mandatory" aria-label="required">
                  *
                </abbr>
                <input type="text" name="required-text" required />
              </label>
            </div>
            <div className="form-control">
              <fieldset>
                <legend>
                  Required checkbox
                  <abbr title="This field is mandatory" aria-label="required">
                    *
                  </abbr>
                </legend>
                <label>
                  <input
                    type="radio"
                    required
                    name="required-checkbox"
                    value="yes"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    required
                    name="required-checkbox"
                    value="maybe"
                  />
                  Maybe
                </label>
                <label>
                  <input
                    type="radio"
                    required
                    name="required-checkbox"
                    value="no"
                  />
                  No
                </label>
              </fieldset>
            </div>
            <div className="form-control">
              <label>
                Text with regex validation (only allow [Bb]anana or [Oo]range)
                <input
                  type="text"
                  name="text-with-regex"
                  list="list1"
                  pattern="[Bb]anana|[Oo]range"
                />
                <datalist id="list1">
                  <option>Banana</option>
                  <option>Cherry</option>
                  <option>Apple</option>
                  <option>Strawberry</option>
                  <option>Lemon</option>
                  <option>Orange</option>
                </datalist>
              </label>
            </div>
            <div className="form-control">
              <label>
                Number with min (12) and max (120) validation
                <input
                  type="number"
                  name="number-with-min-max"
                  min="12"
                  max="120"
                  step="1"
                />
              </label>
            </div>
            <div className="form-control">
              <label>
                Email
                <input name="email" type="email" />
              </label>
            </div>
            <div className="form-control">
              <label htmlFor="text-with-minlength-maxlength">
                Text with minLength(10) and maxLength(140)
              </label>
              <textarea
                name="text-with-minlength-maxlength"
                id="text-with-minlength-maxlength"
                minLength={10}
                maxLength={140}
                rows={3}
              ></textarea>
            </div>
            <div className="form-control">
              <label htmlFor="date-with-min-max">
                Date with min(today) and max(tomorrow)
              </label>
              <input
                type="date"
                name="date-with-min-max"
                id="date-with-min-max"
                min={data.todayString}
                max={data.tomorrowString}
              />
            </div>
            <div className="form-control">
              <button>Submit</button>
            </div>
          </form>
          {actionData?.message ? (
            <div className="result">{actionData.message}</div>
          ) : null}
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
