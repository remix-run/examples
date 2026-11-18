# Remix Auth - GitHub sign-in you can test end to end

GitHub sign-in with Remix Auth, where local development and Playwright tests sign in through [Mockatoo](https://mockatoo.globalunderdog.com), a hosted mock of GitHub's OAuth endpoints. You don't register a GitHub OAuth app until you deploy.

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/remix-auth-mockatoo)

## Example

This uses `remix-auth` and `remix-auth-oauth2`. The `/` route shows a Sign in with GitHub button, or the signed-in user and a Sign out button.

[`app/auth.server.ts`](app/auth.server.ts) picks GitHub's endpoints by `NODE_ENV`:

- **Production** uses github.com and requires `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and `BASE_URL` (see [`.env.example`](.env.example)).
- **Everywhere else** uses Mockatoo's GitHub mock, on the same OAuth paths, with its shared `mockatoo` client. It accepts any localhost callback, so `npm run dev` signs in on a fresh clone.

Mockatoo's login page asks for a test account's email and password. Sign up for free at [app.mockatoo.globalunderdog.com](https://app.mockatoo.globalunderdog.com) and copy them from the dashboard.

## Tests

[`e2e/sign-in.spec.ts`](e2e/sign-in.spec.ts) has two Playwright tests:

1. Sign-in redirects to Mockatoo's login page. It needs no account, so it always runs.
2. A full sign-in and sign-out. It runs when `MOCKATOO_TEST_EMAIL` and `MOCKATOO_TEST_PASSWORD` are set, and skips otherwise.

```sh
npm install
npx playwright install chromium
MOCKATOO_TEST_EMAIL=you@example.com MOCKATOO_TEST_PASSWORD=... npm run test:e2e
```

In CI, add the two values as repository secrets. [`.github/workflows/remix-auth-mockatoo.yml`](../.github/workflows/remix-auth-mockatoo.yml) runs both tests.

## Related Links

- [Remix Auth](https://github.com/sergiodxa/remix-auth)
- [Remix Auth OAuth2](https://github.com/sergiodxa/remix-auth-oauth2)
- [Mockatoo](https://mockatoo.globalunderdog.com)
- [Remix Auth - GitHubStrategy](../remix-auth-github) example
