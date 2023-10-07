# Remix Directus Extension

This example demonstrates how a Remix app can be embedded in a [Directus](https://directus.io) app using an endpoint extension. The app is comprised of three parts:

- The Remix app
- The self-hosted Directus instance
- A Directus endpoint extension, called `remix-frontend`

## What is Directus?

Directus is a self-hosted CMS written in JavaScript and Vue. It allows you to connect a relational database, define data models, view and edit the data, upload and manage files, set up automated workflows and webhooks, view data panels, manage users, roles, and auth... it provides a lot.

It's also highly extensible. Many parts of the UI and backend can be modified and changed using the Directus extension API.

## How it Works

Directus allows you to add API endpoints to a running Directus instance using a special extension. This extension exposes an Express router which we can use to pass requests to our Remix app. With a bit of clever configuration, we can make our app available at the root (eg. `/`) of our Directus instance and serve all requests (except those to the Directus admin at `/admin/*`) from our Remix app.

We can also take advantage of Remix load context and pass Directus utilities to our Remix app. Things like the Directus services, which provide a convenient API for accessing Directus resources, accountability information about the currently logged in user, and direct access to the database.

In this example, we use the `ItemsService`, which is accessed through load context, to pull our list of blog posts in our loader to render to the page.

## Development

This example includes an example environment variables file. 

Before doing anything else, you'll need to set up your Directus instance. From your terminal run:

```sh
npx directus@latest init
```


Follow the prompts to set up the Directus app how you want. If you're just trying it out, use the `sqlite` database driver. 

Once that's done you'll need to add the necessary environment variables at top of the `.env.example` file to your `.env` file. These are required to enable Remix to run from within Directus.

You can apply the example snapshot by running:

```sh
npx directus schema apply ./snapshot.yml
```

Make sure the extension has been built before the Directus instance starts for the first time.

From your terminal:

```sh
npm run build
```

then

```sh
npm run dev
```

This will start the Remix dev server, the extension compiler in watch mode, and the Directus data studio in 
development mode.

You can access your app at `http://localhost:8055` and access the Directus data studio at `http://localhost:8055/admin`.

Sign into the data studio, add a post, visit the site, and you'll see the post appear.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to. It should work out-of-the-box with any Nixpack-compatible host, like Railway or Flightcontrol. It should also work with a simple Node-based Dockerfile on hosts that support that. Just use `npm run build` as the build command and `npm run start` as the start command, and make sure you've set up the necessary environment variables.
