# Server-Sent Events - Simple chat app

This example demonstrates how to use Server-Sent Events to create a simple chat app without persistant storage.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/sse-chat)

## Example

The example uses the `eventStream` response helper from Remix Utils to implement a SSE endpoint.

In that endpoint the server subscribe to an EventEmitter to get new messages and broadcast them to subscribers.

Client-side, the `useEventSource` hook from Remix Utils is used to subscribe to the SSE endpoint and display new messages as they arrive.

All paired with a Remix form to send new messages to an action which are then emitted to the EventEmitter.

## Related Links

- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Remix Utils](https://github.com/sergiodxa/remix-utils#server-sent-events)
- [Event Emitter](https://nodejs.org/api/events.html#events_class_eventemitter)
- [Remix Form](https://remix.run/docs/en/v1/components/form)
- [Remix action](https://remix.run/docs/en/v1/route/action)
