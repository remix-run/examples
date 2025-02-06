# Example app with leaflet map

This is a very basic example of remix app with leaflet map.

- [Remix Docs](https://remix.run/docs)

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/leaflet)

[![Open in Codeanywhere](https://codeanywhere.com/img/open-in-codeanywhere-btn.svg)](https://app.codeanywhere.com/#https://github.com/remix-run/examples)

## Example

This example shows how to use Leaflet with Remix.

Relevant files:

- [app/components/map.client.tsx](app/components/map.client.tsx)

Leaflet cannot be rendered on the server side, so we're using the `ClientOnly` component from `remix-utils` to display a skeleton instead.
It's important to add the `.client.tsx` suffix to the `Map` component file name, otherwise, you will get this error:

```
Error [ERR_REQUIRE_ESM]: require() of ES Module /remix/examples/leaflet/node_modules/react-leaflet/lib/index.js from /remix/examples/leaflet/build/index.js not supported.
```

## Related Links

- [Leaflet docs](https://leafletjs.com/download.html)
- [React Leaflet docs](https://react-leaflet.js.org/)
- [remix-utils](https://github.com/sergiodxa/remix-utils)
