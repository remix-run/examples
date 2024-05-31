# Remix + MSW

This example demonstrates [MSW's][msw] usage with Remix to mock any HTTP calls from the Remix server during development.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/msw)

## Example

- If the API is still under development and we don't want to wait for the API to be completed.
- We want to simulate various edge and error cases of making an HTTP call and check how the app handles these cases.
- If the external APIs are metered and charged for the number of API calls made, it's pretty easy to burst through the API quota during development.
- We need an active network during development if we rely on external HTTP calls for the app to work. For some, this may be an issue.

We can mock the HTTP calls using MSW, which intercepts the API calls from the server and returns a mocked response.

You can read more about the use cases of MSW [here](https://mswjs.io/docs/#when-to-mock-api)

## Relevant files

- [mocks](./mocks/index.cjs) - registers the Node HTTP mock server
- [handlers](./mocks/handlers.cjs) - describes the HTTP mocks
- [package.json](./package.json)

## Related Links

[MSW][msw]

[msw]: https://mswjs.io/
