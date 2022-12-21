# Upload images to cloudinary

This is a simple example of using the remix buildin [uploadHandler](https://remix.run/utils/parse-multipart-form-data#uploadhandler) and Form with multipart data to upload a file with the built-in local uploader and upload an image file to cloudinary with a custom uploader and display it.

The relevent files are:

```
├── app
│   ├── routes
│   │   ├── cloudinary-upload.tsx // upload to cloudinary
│   │   └── local-upload.tsx // local upload using build in [createFileUploadHandler](https://remix.run/utils/unstable-create-file-upload-handler)
│   └── utils
│       └── utils.server.ts  // init cloudinary nodejs client on server side
|── .env // holds cloudinary credentails
```

## Steps to set up cloudinary

- sign up a free [cloudinary account](https://cloudinary.com/)
- get the cloudname, api key and api secret from dashboard
- copy the .env.sample to .env and populate the credentials

Open this example on [CodeSandbox](https://codesandbox.com):

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/remix-run/examples/tree/main/file-and-cloudinary-upload)

## Related Links

- [Handle Multiple Part Forms (File Uploads)](https://remix.run/utils/parse-multipart-form-data-node)
- [Upload Handler](https://remix.run/utils/parse-multipart-form-data#uploadhandler)
- [Custom Uploader](https://remix.run/guides/file-uploads)
