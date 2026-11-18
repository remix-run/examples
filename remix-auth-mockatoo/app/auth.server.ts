import { createCookieSessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";

const isProduction = process.env.NODE_ENV === "production";

// Outside production, GitHub sign-in goes through Mockatoo, a hosted mock of
// GitHub's OAuth endpoints. It accepts any localhost callback with the shared
// `mockatoo` client, so a fresh clone (or a CI run) can sign in without
// registering a GitHub OAuth app.
const MOCKATOO_URL = "https://app.mockatoo.globalunderdog.com/github";
const github = isProduction
  ? {
      clientId: requireEnv("GITHUB_CLIENT_ID"),
      clientSecret: requireEnv("GITHUB_CLIENT_SECRET"),
      authorizationEndpoint: "https://github.com/login/oauth/authorize",
      tokenEndpoint: "https://github.com/login/oauth/access_token",
      userEndpoint: "https://api.github.com/user",
    }
  : {
      clientId: "mockatoo",
      clientSecret: "mockatoo-secret",
      authorizationEndpoint: `${MOCKATOO_URL}/login/oauth/authorize`,
      tokenEndpoint: `${MOCKATOO_URL}/login/oauth/access_token`,
      userEndpoint: `${MOCKATOO_URL}/api/v3/user`,
    };

const BASE_URL = isProduction
  ? requireEnv("BASE_URL")
  : process.env.BASE_URL || "http://localhost:5173";

export interface User {
  login: string;
  name: string | null;
  email: string | null;
}

export const sessionStorage = createCookieSessionStorage<
  { user: User },
  { error: string }
>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret"], // This should be an env variable
    secure: isProduction,
  },
});

export const authenticator = new Authenticator<User>();

authenticator.use(
  new OAuth2Strategy(
    {
      clientId: github.clientId,
      clientSecret: github.clientSecret,
      authorizationEndpoint: github.authorizationEndpoint,
      tokenEndpoint: github.tokenEndpoint,
      redirectURI: new URL("/auth/github/callback", BASE_URL),
      scopes: ["read:user", "user:email"],
    },
    async ({ tokens }) => {
      const response = await fetch(github.userEndpoint, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`GitHub user request failed: ${response.status}`);
      }
      const { login, name, email } = (await response.json()) as User;
      return { login, name, email };
    },
  ),
  "github",
);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required in production`);
  return value;
}
