# Remix + UnoCSS

UnoCSS is the instant, on-demand atomic CSS engine. It has various advantages over Tailwind CSS. Read more in the [GitHub readme](https://github.com/unocss/unocss).

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/unocss)

## Example

This example shows a bare-bones setup of UnoCSS.

List of dependencies installed:

- `unocss`
- `@unocss/reset`
- `@unocss/cli`

The `scripts` in [`package.json`](./package.json) have been updated to use the UnoCSS CLI to generate CSS into `app/styles/uno.css`. This file is imported to [`app/root.tsx`](./app/root.tsx) to apply these styles into the Remix app. A Tailwind CSS preset is also being used from `@unocss/reset` to add basic global styles according to Tailwind CSS defaults.

You can add more presets in [`unocss.config.ts`](./unocss.config.ts).

## Related Links

- [UnoCSS GitHub](https://github.com/unocss/unocss)
- [UnoCSS Docs](https://uno.antfu.me)
