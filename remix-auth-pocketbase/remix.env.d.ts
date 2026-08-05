/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

declare global {
  interface Window {
    ENV: {
      POCKETBASE_URL: string;
    };
  }
}

export {};
