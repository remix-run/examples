# TUS Integration Resumable File Uploads

This is an example to use the Tus Protocol to upload files to either a Google Cloud Bucket or your internal file storge

The relevent files are:

```
├── app
|   ├── bucket.server.tsx // if using google cloud bucket - store your credentials here
|   ├── tusCloudBucketHandler.server.tsx // this file handles different request methods used by Tus Protocol for cloud bucket integration
|   ├── tusFileStoreHanlder.server.tsx // this file handles different request methods used by Tus Protocol for uploading files to an internal file storage/directory within your 
|   ├── routes
|   │   └── _index.tsx  // front end end file with basic form and tus-js client that uploads file to a designated route
|   │   └── api.tus-cloud-uploads.tsx  // initial route Tus uses to POST and create file for cloud bucket integration
|   │   └── api.tus-cloud-uploads.$fileId.tsx  // Afte file is created Tus makes patch requests to the file that was created using the POST request to update the file in "chunks" for cloud bucket integration
|   │   └── api.tus-native-uploads.tsx  // initial route Tus uses to POST and create file on local files system
|   │   └── api.tus-native-uploads.$fileId.tsx  // Afte file is created Tus makes patch requests to the file that was created using the POST request to update the file in "chunks" for local file system integration
|   └── utils
|       └── supabaseClient.server.tsx // create supabase client on the server side
└── .env // hold cloud bucket credentials secret key
```

## Setup

1. Copy `.env.example` to create a new file `.env`:

```sh
cp .env.example .env
```

## Example

Servers like Cloud Run usually have a fixed limit ~32 mb of what data your upload to the server at one time,  The Tus Protocol solves these limits by uploading files in chunks, when large files are uploaded there can be network issues but when files are uploaded in chuunks in tus prootcol tus keeps track of when a file stopped uploading and can resume the upload.

## Related Links

Tus Protocol generally utilizes a front end and a back end, while integrating Tus-Js-Client npm package was relatively easy in a remix application - integrating Tus Server required either an implemented Node/Expres server that didn't quite fit into the remix architecture of using web fetch Api, rather it uses the native req, res objects in Express, instead of using the TusServer npm package which is tighly couple to Express/Node, the tusHanlerServer files basically implement the tus Server request methods while not being confined to using Express.  The TusHandler handles the same request methods required by the tus protocol "POST" - creation of file, "PATCH" - updates to File - "HEAD" - Get metadata regarding file  

## Production
On an environment like cloud run you may need to set content security policy header
```
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
    next();
  });
}
```  
see issue here - https://github.com/tus/tus-js-client/issues/186


## To Run exmaple  
`npm i`  
in `_index.tsx` when tusClientUploader is invoked you have th option to call either `/api/tus-cloud-uploads` endpoint or the `/api/tus-native-uploads` endpoint when calling the cloud-uploads endpoint you must provide a bucketName `${bucketName}` the other endpoint requires a directory path like `./uploads/tus`  
`npm run dev`
use ux to upload file and watch the magic happen
