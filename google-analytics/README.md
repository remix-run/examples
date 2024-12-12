# Google Analytics Example

In this setup we will setup Google Analytics with Remix.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/google-analytics)

[![Open in Codeanywhere](https://codeanywhere.com/img/open-in-codeanywhere-btn.svg)](https://app.codeanywhere.com/#https://github.com/remix-run/examples)

## Example

This example shows how to use Google analytics with Remix.

- Copy `.env.example` to `.env`
- Configure your Google Analytics ID in the `.env` file (read from the `entry.server.tsx` file)
- Run the project

Check [app/root.tsx](./app/root.tsx) where page tracking code is added. For tracking events check [app/routes/contact.tsx](./app/routes/contact.tsx) file.

The Google Analytics tag is disabled in "development", you can enable it during your test, but make sure to only enable tracking in production.

## Related Links

[Google Analytics](https://analytics.google.com/analytics/web/)
