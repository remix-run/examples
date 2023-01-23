# Remix Authentication with SAML and LDAP fallback

This is a demo of how to do SAML authentication with LDAP as a fallback.

The demo requires docker to run the LDAP test server.

## Steps to run

Install the deps:

```bash
npm install

# setup saml server
npm run saml:setup
```

Update the `.env` file database connection, the rest of the default values will work.

Setup the database:

```bash
npm run setup
```

Do an initial build:

```bash
npm run build
```

Start up dev:

Note: Docker is required here to run the LDAP server and also openssl for generating SAML certs.

Running this command will generate a new SAML cert, start LDAP, SAML, and the site. Wait until you see all three running before accessing the website http://localhost:3000.

```bash
npm run dev
```

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

<!-- TODO: update this link to the path for your example: -->

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/auth-saml-ldap)

## Example

When you access the website you will be redirected to SAML for authentication. After clicking "login" on the SAML server you will be sent back to the `/auth/asc` route where the user will be stored in the DB and a session created.

If for some reason SAML fails (server offline, cert busted, etc) you will be directed the the `/login` route which is using LDAP.

Sessions can be destroyed by calling the `/logout` or `/auth/slo` routes.
