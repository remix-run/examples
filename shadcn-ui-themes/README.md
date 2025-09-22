# shadcn/ui with Theme Switcher

This example shows how to use [shadcn/ui](https://ui.shadcn.com/) components along with [remix-themes](https://github.com/abereghici/remix-themes) to store the preferred color scheme in the session and let the user manually switch between light and dark mode.

> [!NOTE]
> This example uses Remix v2.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/shadcn-ui-themes)

## Example

This example uses `shadcn/ui` components. They are stored in the [app/components/ui](./app/components/ui/) folder.
In the [root loader](./app/root.tsx), we retrieve the preferred color scheme from the session. We pass it to the `ThemeProvider` from `remix-themes`. Switching the color scheme is achieved by using the `useTheme` hook from `remix-themes` and calling an action on [/action/set-theme](./app/routes/action.set-theme.ts), which will update the session.

`:root[class~="dark"]` is added to the [app/tailwind.css](./app/tailwind.css?plain=1#L39) to be able to use the `dark` class on the html element to apply the dark mode styles.

The configuration for the `shadcn/ui` components is stored in [components.json](./components.json). New components can be added with:

```bash
npx shadcn-ui@latest add <component-name>
```

## Related Links

- [shadcn/ui](https://ui.shadcn.com/)
- [remix-themes](https://github.com/abereghici/remix-themes)
- [Tailwind CSS](https://tailwindcss.com/)
