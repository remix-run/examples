import { GCSStore } from "@tus/gcs-store";
import { getCloudStorage } from "./bucket.server"
import { Readable } from "stream";
const { randomUUID } = await import("node:crypto");

const storage = getCloudStorage();


export async function handleTusRequest(request:any, method: string, id?:string, fileType?: string, nameOfBucket?: string) {

  // we only do this on a GET request to update metadata of content type
  if (id && nameOfBucket && fileType) {
    const bucket = storage.bucket(nameOfBucket);
    const file = bucket.file(id);
    const fileMetadata = await file.setMetadata({
      contentType: fileType,
    });
    return fileMetadata;
  }

  switch (method) {
    case "POST":
      return handlePostRequest(request);
    case "PATCH":
      return handlePatchRequest(request);
    case "HEAD":
      return handleHeadRequest(request);
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}

async function handlePostRequest(request: any) {
  const uploadLength = request.headers.get("Upload-Length");
  const metadata = request.headers.get("Upload-Metadata");
  const parsedMetaData = parseMetadata(metadata);

  const { destination } = parsedMetaData;
  const targetBucket = destination;

  const store = new GCSStore({
    bucket: storage.bucket(targetBucket),
  });

  let id;

  if (!uploadLength) {
    return new Response("Upload-Length header is required", { status: 400 });
  }
  console.log({ uploadLength });

  const genereatedId = randomUUID();
  try {
    const file = await store.create({
        metadata: parsedMetaData,
        id: genereatedId,
        offset: parseInt(uploadLength),
        size: uploadLength,
        creation_date: undefined,
        storage: undefined,
        sizeIsDeferred: false
    });

    id = file.id;
  } catch (error) {
    console.error("Error creating file:", error);
  }

  const location = new URL(request.url);
  location.pathname += `/${id}`;
  location.search = `?bucket=${targetBucket}`;

  return new Response(null, {
    status: 201,
    headers: {
      Location: location.toString(),
      "Tus-Resumable": "1.0.0",
    },
  });
}

async function handlePatchRequest(request: any) {
  const url = new URL(request.url);
  const fileId = url.pathname.split("/").pop();
  const bucketName = url.searchParams.get("bucket");
  const offset = parseInt(request.headers.get("Upload-Offset") || "0");

  if (!bucketName) {
    return new Response("bucket name not provided", { status: 404 });
  }

  const store = new GCSStore({
    bucket: storage.bucket(bucketName),
  });

  if (!store) {
    return new Response("Upload not found", { status: 404 });
  }

  if (!fileId) {
    return new Response("File ID is required", { status: 400 });
  }
  try {
    const body = await request.arrayBuffer();
    if (!body) {
      return new Response("Request body is missing", { status: 400 });
    }

    const buffer = Buffer.from(body);
    const readable = Readable.from(buffer);
    const newOffset = await store.write(readable, fileId, offset);

    console.log({ newOffset });

    return new Response(null, {
      status: 204,
      headers: {
        "Upload-Offset": newOffset.toString(),
        "Tus-Resumable": "1.0.0",
      },
    });
  } catch (error) {
    console.error("Error handling PATCH request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function handleHeadRequest(request:any) {
  const url = new URL(request.url);
  const fileId = url.pathname.split("/").pop();
  const bucketName = url.searchParams.get("bucket");

  if (!fileId) {
    return new Response("File ID is required", { status: 400 });
  }

  if (!bucketName) {
    return new Response("bucket name not provided", { status: 404 });
  }

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileId);

  try {
    const [metadata] = await file.getMetadata();
    console.log({ metadata });

    const thirdTierMetaData = metadata?.metadata?.metadata;

    const stringifyMetaData = stringify(thirdTierMetaData);

    const metaDataOffset =  metadata?.metadata?.["offset"];
    const uploadSizeMetaData = metadata?.metadata?.["size"];

    const uploadOffset = parseInt(metaDataOffset as any, 10);
    const uploadSize = parseInt(uploadSizeMetaData as any, 10);

    return new Response(null, {
      status: 200,
      headers: {
        "Upload-Offset": uploadOffset.toString(),
        "Upload-Length": uploadSize.toString(),
        "Tus-Resumable": "1.0.0",
        "Cache-Control": "no-store",
        "Upload-Metadata": stringifyMetaData,
      },
    });
  } catch (error) {
    console.error("Error retrieving upload info:", error);
    throw error;
  }
}

function parseMetadata(metadata: any) {
  if (!metadata) return {};
  const data = metadata.split(",").reduce((acc: { [x: string]: string; }, pair: { split: (arg0: string) => [any, any]; }) => {
    const [key, value] = pair.split(" ");
    acc[key] = Buffer.from(value, "base64").toString("utf-8");
    return acc;
  }, {});
  return data;
}

function stringify(metadata: NonNullable<any>): string {
  return Object.entries(metadata)
    .map(([key, value]) => {
      if (value === null) {
        return key
      }

      const encodedValue = Buffer.from(value as any, 'utf8').toString('base64')
      return `${key} ${encodedValue}`
    })
    .join(',')
}
