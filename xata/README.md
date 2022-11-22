# Xata example

This example showcases how to use Remix with [Xata](https://xata.io) as your data layer.

You get out-of-the-box:

- API Route to connect to your Xata database
- Type-safe Codegen

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

- [![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/xata)

## Example

Execute [`create-remix`](https://github.com/remix-run/remix/tree/main/packages/create-remix) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```sh
npx create-remix@latest --template xata remix-xata-app
```

### Link Your Xata Workspace and Run Codegen

```sh
npm run xata:init
```

In case you have a workspace already linked, you will need to use `--force` flag to push the template schema on top of an existing one.

> 💡 consider [installing the Xata CLI globally](https://xata.io/docs/cli/getting-started), it will likely improve your experience managing your databases

Once linked, you can just run `xata:codegen` to re-generate types.

### Start Coding

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

> 💡 the template will prompt you to create a dummy new table (`remix_with_xata_example`) with some useful resources.

## Related Links

- [Xata Docs](https://xata.io/docs)
- [Xata VS Code Extension](https://marketplace.visualstudio.com/items?itemName=xata.xata) will make managing your data more comfortable
- [Xata Discord](https://xata.io/discord)
