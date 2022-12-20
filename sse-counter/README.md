# Server-Sent Events - Counter

This example demonstrates how to use Server-Sent Events to create a simple counter that updates in real-time.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/sse-counter)

## Example

The example uses the `eventStream` response helper from Remix Utils to implement a SSE endpoint.

In that endpoint the server starts an interval that emits a new message every second with the current time formatted in English.

Client-side, the `useEventSource` hook from Remix Utils is used to subscribe to the SSE endpoint and display the new date.

## Related Links

- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Remix Utils](https://github.com/sergiodxa/remix-utils#server-sent-events)
- [Event Emitter](https://nodejs.org/api/events.html#events_class_eventemitter)
