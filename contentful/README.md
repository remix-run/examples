# Contentful Example

An example portfolio website demonstrating integration of Remix with Contentful.

## Preview

View the live example [here](https://contentful-remix-portfolio.netlify.app/).

## Example

- Uses the [Contentful GraphQL API](https://www.contentful.com/developers/docs/references/graphql/) to fetch the content.
- Uses the [rich-text-html-renderer](https://www.npmjs.com/package/@contentful/rich-text-html-renderer) to render Rich Text.

## Quick Start

Follow the steps mentioned below to set up and run the project quickly. For more detailed instructions, follow the steps mentioned in [Configuration](#configuration).

### Step 1. Get the source code and install dependencies

Run the following command in your terminal to clone the Contentful Remix stack.

```bash
npx create-remix@latest --template https://github.com/contentful/starter-remix-portfolio
```

Enter a name for your project, select your prefered language (TypeScript/JavaScript), and type Y to install the dependencies.

You will get an output as follow:

```bash
npx create-remix@latest --template contentful/starter-remix-portfolio
? Where would you like to create your app? corgi-portfolio
? TypeScript or JavaScript? JavaScript
? Do you want me to run `npm install`? Yes
⠼ Creating your app…(⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂) ⠼ reify: timing arborist:ctor Completed
npm WARN ERESOLVE overriding peer dependency
...
...
```


### Step 2. Set up the content model

The stack comes with a Contentful set up command that imports the required content model and adds sample content to your space.

The command asks you for a [Space ID](https://www.contentful.com/help/find-space-id/), and [Content Management API](https://www.contentful.com/developers/docs/references/content-management-api/) Access Token, and the [Conetnt Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) Access Token.

When prompted, enter the above mentioned details in the terminal respectively.

The output will be as follow:

```bash
...
209 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
💿 Running remix.init script
? Enter you Contentful Space ID SPACE_ID
? Enter you Content Delivery API Key CONTENT_DELIVERY_KEY
? Enter you Content Management Token CONTENT_MANAGEMENT_KEY
Creating .env file...
Updating files...
Removing temporary files from disk.
Running the setup script to import content model
┌──────────────────────────────────────────────────┐
│ The following entities are going to be imported: │
├────────────────────────────────┬─────────────────┤
│ Content Types                  │ 7               │
├────────────────────────────────┼─────────────────┤
│ Tags                           │ 0               │
├────────────────────────────────┼─────────────────┤
│ Editor Interfaces              │ 7               │
├────────────────────────────────┼─────────────────┤
│ Entries                        │ 29              │
├────────────────────────────────┼─────────────────┤
│ Assets                         │ 12              │
├────────────────────────────────┼─────────────────┤
│ Locales                        │ 1               │
├────────────────────────────────┼─────────────────┤
│ Webhooks                       │ 0               │
└────────────────────────────────┴─────────────────┘
(node:23674) ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
  ✔ Validating content-file
  ✔ Initialize client (1s)
  ...
```


### Step 3. Run it locally

```bash
npm run dev
```

Navigate to `localhost:3000` to view the Portfolio.

## Related Links

Learn more about this example in [this guide](https://www.contentful.com/remix-tutorial/) by Contentful.
