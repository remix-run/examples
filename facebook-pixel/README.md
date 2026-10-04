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

- Check [app/routes/view-content.tsx](./app/routes/view-content.tsx) to see how to send specific standard events using a Button to trigger / send the event.
- Check [app/routes/custom-content.tsx](./app/routes/cuctom-content.tsx) to see how to send your own custom events using a Button to trigger / send the event.


  You should see warning in the browser console when you open your app in dev mode. That's fine.

  Here's the result in Facebook Events Manager
  ![Screenshot 2024-11-04 at 21 27 43](https://github.com/user-attachments/assets/92127622-2575-4df6-8c2e-6479037b9cc7)


## Related Links

[Facebook Pixel Events Specification](https://developers.facebook.com/docs/meta-pixel/reference)
