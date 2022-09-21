# Example app with [Material UI](https://mui.com/)

This example features how to use [Material UI](https://mui.com/) as the component library within a Remix app.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/material-ui)

## Example

The template bootstraps SSR for MUI by adding `emotion cache` to [entry.server.js](./app/entry.server.js#23) and [entry.client.js](./app/entry.client.js#30).

[According to MUI docs](https://mui.com/material-ui/guides/server-rendering/#mui-on-the-server) this will-

1. Create a fresh, new emotion cache instance on every request.
2. Render the React tree with the server-side collector.
3. Pull the CSS out.
4. Pass the CSS along to the client.

On the client-side, the CSS will be injected a second time before removing the server-side injected CSS.

## Related Links

- [MUI Docs](https://mui.com/)
- [MUI's official Remix example](https://github.com/secretshardul/material-ui/tree/master/examples/remix-with-typescript)
- [Server rendering guide for MUI](https://mui.com/material-ui/guides/server-rendering/)
