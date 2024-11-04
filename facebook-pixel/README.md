# TODO: Title of Example

Setup Facebook Pixel with Remix. Inspired by the ```google-analytics``` example, we will do some adjustments to make sending Pixel events work with Remix.



## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

<!-- TODO: update this link to the path for your example: -->

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/__template)

## Example

- Check ```app/utils/pixel.client.ts```. its a simple wrapper for the pixel's ```fbq``` function.

- Check [app/root.tsx](./app/root.tsx) to see how the Facebook Pixel script is added.

  We use ```root.stx``` to fire initial events and the default ```PageView``` event. Every url visited in the app will fire a ```PageView``` event.

- Check [app/routes/contact.tsx](./app/routes/contact.tsx) to see how to send specific events using a Button to trigger / send the event.

  You can follow and replicate the example in ```contact.tsx``` to any routes / components in your app.

## Related Links

[Facebook Pixel Events Specification](https://developers.facebook.com/docs/meta-pixel/reference)
