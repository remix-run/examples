# Toast Messages

A simple example to add toast messages in Remix

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/toast-message)

## Example

It's a pretty common use case to provide feedback to the users in the form of toast messages. In this example, we take a look at how to use session cookies to set the feedback messages at the action handler and read from the session cookie at the root loader. When we make a `non-GET` request Remix automatically reloads all the matching loaders, and since root loader will always be called, it's a good place to keep our toast message component.

## Why does this works?

We use the `flash` method in the session object to set the message. Once we read the value set using the `flash` method, the value will be unset from the session when we commit the session. Thus on the following request, when the loader reads the cookie, the value won't be there and, we can avoid reading the same value between requests.

## Relevant files

- [root.tsx](./app/root.tsx)
- [index.tsx](./app/routes/index.tsx)
- [message.server.ts](./app/message.server.ts)

## Related Links

- [Remix Sessions](https://remix.run/utils/sessions)
- [Remix Cookie Sessions](https://remix.run/utils/sessions#createcookiesessionstorage)
- [Remix Session API](https://remix.run/utils/sessions#session-api)
- [Remix API route](https://remix.run/guides/api-routes)
- [react-hot-toast](https://react-hot-toast.com)
