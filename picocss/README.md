# Remix Example with PicoCSS

Welcome to Remix+PicoCSS Template

PicoCSS is a Minimal CSS Framework for Semantic HTML

## Install

```
npx create-remix@latest --template examples/picocss
```

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/picocss/tree/main/picocss)

## Related Links

- [Remix Docs](https://remix.run/docs)
- [PicoCSS Docs](https://picocss.com/docs/)

## Wanna install PicoCSS in your existing project?

```console
$ npm install picocss@latest
```

Create a `app/style.css` file with:

```css
@import url("@picocss/pico");

# more css here...
```

Import `app/style.css` into your `app/root.tsx` file:

```ts
//imports
import styles from "./styles.css";

// ...code...

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

// ...code...
```
