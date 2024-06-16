# ErrorBoundary Example

If you want to handle errors, export an `ErrorBoundary` from your route.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/error-boundary)

## Example

In this example, we have a list of users and one user that does not exist. When you navigate to the user that does not exist, our ErrorBoundary renders in place of the component for that route.

Check [app/routes/users/$userId.tsx](app/routes/users/$userId.tsx) to see the ErrorBoundary in action.

## Related Links

- [ErrorBoundary in the Remix Docs](https://remix.run/route/error-boundary)
