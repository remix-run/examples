# Segment Example

Basic setup for Segment with Remix.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/segment)

## Example

This example shows how to use Remix along with [Segment](https://segment.com/) using [Analytics.js 2.0](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#analytics-js-2-0-source)

First you have to get your [write key](https://segment.com/docs/getting-started/02-simple-install/#find-your-write-key) and add it to the [.env.example](./.env.example) file.

[Segment snippet](https://segment.com/docs/getting-started/02-simple-install/#step-1-copy-the-snippet) is loaded on [app/root.tsx](./app/root.tsx) along with the page tracking code.

For tracking events check [app/routes/contact.tsx](./app/routes/contact.tsx) file.

## Related Links

[Segment Docs](https://segment.com/docs/getting-started/02-simple-install/)

[Segment Analytics.js 2.0](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#analytics-js-2-0-source)
