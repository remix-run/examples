# Mux Video

This example uses Mux Video, an API-first platform for video. The example features video uploading and playback in a Remix.js application.

This example is useful if you want to build a platform that supports user-uploaded videos. For example:
- Enabling user profile videos
- Accepting videos for a video contest promotion
- Allowing customers to upload screencasts that help with troubleshooting a bug
- Or even the next Youtube, TikTok, or Instagram

## Preview

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/mux-video)

## How to use

### Step 1. Create a Remix app with this example

```bash
npx create-remix@latest --template examples/mux-video
```

### Step 2. Create an account in Mux

All you need to run this example is a [Mux account](https://www.mux.com?utm_source=remix-examples&utm_medium=mux-video&utm_campaign=remix-examples).

Before entering a credit card on your Mux account, all videos are in “test mode” which means they are watermarked and clipped to 10 seconds.

### Step 3. Set up environment variables

Copy the `.env.example` file in this directory to `.env` (which will be ignored by Git):

```bash
cp .env.example .env
```

Then, go to the [settings page](https://dashboard.mux.com/settings/access-tokens) in your Mux dashboard, get a new **API Access Token** with "Mux Video Read" and "Mux Video Write" permissions. Use that token to set the variables in `.env.local`:

- `MUX_TOKEN_ID` should be the `TOKEN ID` of your new token
- `MUX_TOKEN_SECRET` should be `TOKEN SECRET`

At this point, you're good to `npm run dev`.

## How it works

Uploading and viewing a video takes four steps:

1. **Upload a video**: Use the Mux [Direct Uploads API](https://docs.mux.com/api-reference#video/tag/direct-uploads?utm_source=remix-examples&utm_medium=mux-video&utm_campaign=remix-examples) to create an endpoint for [Mux Uploader React](https://docs.mux.com/guides/mux-uploader?utm_source=remix-examples&utm_medium=mux-video&utm_campaign=remix-examples). The user can then use Mux Uploader to upload a video.
1. **Exchange the `upload.id` for an `asset.id`**: Once the upload is complete, it will have a Mux asset associated with it. We can use the [Direct Uploads API](https://docs.mux.com/api-reference#video/tag/direct-uploads?utm_source=remix-examples&utm_medium=mux-video&utm_campaign=remix-examples) to check for that asset.
1. **Use the `asset.id` to check if the asset is ready** by polling the [Asset API](https://docs.mux.com/api-reference#video/tag/assets?utm_source=remix-examples&utm_medium=mux-video&utm_campaign=remix-examples)
1. **Play back the video with [Mux Player React](https://docs.mux.com/guides/mux-player-web?utm_source=remix-examples&utm_medium=mux-video&utm_campaign=remix-examples)** (on a page that uses the [Mux Image API](https://docs.mux.com/guides/get-images-from-a-video) to provide og images)

These steps correspond to the following routes:

1. [`_index.tsx`](app/routes/_index.tsx) creates the upload in a loader, and exchanges the `upload.id` for an `asset.id` in an action which redirects to...
2. [`status.$assetId.tsx`](app/routes/status.$assetId.tsx) polls the Mux API to see if the asset is ready. When it is, we redirect to...
3. [`playback.$playbackId.tsx`](app/routes/playback.$playbackId.tsx) plays the video.

## Preparing for Production

### Set the cors_origin

When creating uploads, this demo sets `cors_origin: "*"` in the [`app/routes/_index.tsx`](app/routes/_index.tsx) file. For extra security, you should update this value to be something like `cors_origin: 'https://your-app.com'`, to restrict uploads to only be allowed from your application.

### Consider webhooks

In this example, we poll the Mux API to see if our asset is ready.  In production, you'll likely have a database where you can store the `upload.id` and `asset.id`, and you can use [Mux Webhooks](https://docs.mux.com/guides/listen-for-webhooks) to get notified when your upload is complete, and when your asset is ready.
In this example, we poll the Mux API to see if our asset is ready. In production, you'll likely have a database where you can store the `upload.id` and `asset.id`, and you can use [Mux Webhooks](https://docs.mux.com/guides/listen-for-webhooks) to get notified when your upload is complete, and when your asset is ready.

