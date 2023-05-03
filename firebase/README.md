# Firebase

This project demonstrates how to use Firebase with Remix.

## Preview

See the screen recording at `./screen_recording.gif` or Open this example on [CodeSandbox](https://codesandbox.com):

<!-- TODO: update this link to the path for your example: -->

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/firebase)

## Running locally

To run this example, you either need to create a Firebase project or use [the emulators](https://firebase.google.com/docs/emulator-suite):

### 1. Run against a Firebase project

1. [Create a Firebase project](https://console.firebase.google.com).
2. Enable [Auth](https://firebase.google.com/docs/auth) (with email) and [Cloud Firestore](https://firebase.google.com/docs/firestore).
3. Add a Web App with hosting.
4. Copy `.env.example` to `.env`.
5. Set the `API_KEY` value to the [Web API Key](https://firebase.google.com/docs/reference/rest/auth), which can be obtained on the project settings page in your Firebase admin console.
6. Set `SERVICE_ACCOUNT` to the contents of your service account's private key JSON file:
   - Go to: Project > Project Settings > Service Accounts.
   - Click "Create Service Account" or "Generate New Private Key" to download the JSON file.

### 2. Use the Firebase emulators

1. Run `npm run emulators` in one terminal window
2. Run `npm run dev` in a second

When the SERVICE_ACCOUNT and CLIENT_CONFIG environment variables have not been set, `npm run dev` will default to using the local emulator.

When you run `npm run emulators`, an initial user is created with credentials `user@example.com:password`. This can be configured in `firebase-fixtures/auth/accounts.json` or via the emulator UI.

## Deploying

1. Follow the "Run against a Firebase Project" steps above if not done already
2. Log in to the CLI with `npm run firebase -- login`
3. Run `npm run firebase -- use --add` and choose the Firebase project you want to deploy to
4. Deploy with `npm run firebase -- deploy`

## Integration with Google Sign-in Provider

The "Login with Google" link will only work when running against a Firebase Project.

After the steps in "Run against a Firebase Project" have been completed:

- In the [Firebase Console](https://console.firebase.google.com), navigate to Authentication > Sign-in method > Add new provider > Google. Make a note of the client ID and secret and add them to the .env file as GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.
- In the [Google Cloud Credentials Console](https://console.cloud.google.com/apis/credentials), select the Web client (under OAuth 2.0 Client IDs) and the following as authorised redirects:
  - `http://localhost:3000/auth/google`
  - `http://localhost:5002/auth/google`
  - `http://127.0.0.1:3000/auth/google`
  - `http://127.0.0.1:5002/auth/google`
  - `https://<projectid>.firebaseapp.com/auth/google`

## Details

### Auth (`app/server/auth.server.ts`)

`signIn` returns a Firebase session-cookie-string, when sign-in is successfull. Then Remix `cookieSessionStorage` is used to set, read and destroy it.

`signUp` creates a user and calls sign-in to receive the session cookie.

`requireAuth` uses `firebase-admin` to verify the session cookie. When this check fails, it throws a `redirect` to the login page. Use this method to protect loaders and actions. The returned `UserRecord` can be handy to request or manipulate data from the Firestore for this user.

### Firestore (`app/server/db.server.ts`)

Requests to the Firestore are made using the `firebase-admin`-SDK. You need to check validity of your requests manually, since `firestore.rules` don't apply to admin requests.

`converter` and `datapoint` are utilities to allow typed Firestore data reads and writes.

## Links

- [Firestore Data Converters](https://firebase.google.com/docs/reference/node/firebase.firestore.FirestoreDataConverter) for typing
- [Firebase Session Cookies](https://firebase.google.com/docs/auth/admin/manage-cookies)
- [Remix `cookieSessionStorage`](https://remix.run/utils/sessions#createcookiesessionstorage)
