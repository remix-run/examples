# Example app with [Styled Components](https://styled-components.com/)

This example features how to use [Styled Components](https://styled-components.com/) with Remix.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/styled-components)

## Example

To support server-side rendering without hydration errors, [Styled Components uses a Babel plugin to ensure consistent class names across server and client.](https://styled-components.com/docs/advanced#tooling-setup) In this example the source code for our styled components is in `components/src`. This is compiled with the Babel CLI (to generate JavaScript files) and `tsc` (to generate `.d.ts` files), co-ordinated using [npm-run-all](https://www.npmjs.com/package/npm-run-all). The output from both of these tools is generated in `app/components` which is ignored by Git. The app can then import these components from `~/components/*`.

One notable aspect of Styled Components that we need to manage is the way in which it injects styles into the `head` element. This clashes with the model of using React to render the entire document from the root because Styled Components doesn't expect the `head` element to be remounted. When this happens, any CSS that Styled Components thinks is in the document is actually removed, resulting in a loss of styling. In order to avoid this issue when navigating between error routes and non-error routes, we need to wrap the entire app in a pathless route which in this example we're calling `__boundary`. This allows us to handle top-level errors without re-mounting the entire app.

## Relevant files

- [app/root.tsx](./app/root.tsx) - This is where we render the app and if we're rendering on the server we have placeholder text of `__STYLES__`.
- [app/entry.server.tsx](./app/entry.server.tsx) - This is where we render the app on the server and replace `__STYLES__` with the styles that styled-components collect.
- [app/routes/\_\_boundary.tsx](./app/routes/__boundary.tsx) - The top-level error boundary for the app to avoid re-mounting the document.
- [app/routes/\_\_boundary/\$.tsx](./app/routes/__boundary/$.tsx) - The top-level splat route that manually throws a 404 response so we can catch it in `__boundary.tsx`.
- [components/src/Box.tsx](./components/src/Box.tsx) - An example `styled` component.

## Related Links

[Styled-Components](https://styled-components.com/)
