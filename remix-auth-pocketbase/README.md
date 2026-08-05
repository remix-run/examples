# Pocketbase example

This is an example showing a basic integration of Remix with [Pocketbase](https://pocketbase.io/).

## Example

### Getting started

First, install dependencies in both the root folder (right here)

```bash
npm i
```

Then, start both the Remix and Pocketbase with

```bash
npm run dev
```

### Pocketbase

In this example, a Pocketbase instance will be downloaded to `pocketbase/`. Using the migration framework, an admin user and app user will be created. A `realtime_example` collection will be created and supported with `pocketbase/pb_hooks/realtime.pb.js` by a `cronAdd` function. __In order for the email verification and forgot-password emails to work, you will need to setup SMTP in the Pocketbase admin.__ You can also manually verify new accounts in the Pocketbase admin for testing.

> Note that in a real app, you'd likely not have your admin password commited in a migration. This is for demo purposes only.

#### Administration Panel

Pocketbase's administration panel is at [http://localhost:8090/_](http://localhost:8090/_).

<pre>
# Credentials
Email:    <strong>pocketbase@remix.example</strong>
Password: <strong>Passw0rd</strong>
</pre>

### Remix

The Remix app is at http://localhost:3000. The following routes are provided:

- __/__ - with links to the below
- __/login__ - populated with the test user by default
- __/register__ - populated with `2+pocketbase@remix.example` by default
- __/forgot-password__ - populated with the test user's email by default
- __/admin__ - accessible only after login and count is auto updated by way of Pocketbase's Realtime API

There are two Pocketbase files, `pb.server.ts` and `pb.client.ts`. `pb.server.ts` handles the connection to the server for the auth and setting the cookies for persistence. It can also be used in the `loader` functions to prepopulate data on the server. `pb.client.ts` creates a new Pocketbase instance for the client. It uses the cookie setup on server for authenticating. You can use the client export for `useEffect` hooks or the realtime data API. `admin.tsx` has an example of loading data on the server and the realtime API.

You may want to implement a `Content Security Policy` as this setup requires `httpOnly: false` set on the Pocketbase cookie to share between the server and client. This demo does not cover CSP.
