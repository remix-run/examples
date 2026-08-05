import { Readable } from "stream";
const { randomUUID } = await import("node:crypto");
import { FileStore } from "@tus/file-store";


export async function handleTusRequest(request:any, method: string) {

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
  const directory = destination;

  const dataStore = new FileStore({directory});

  let id;

  if (!uploadLength) {
    return new Response("Upload-Length header is required", { status: 400 });
  }
  console.log({ uploadLength });

  const genereatedId = randomUUID();
  try {
    const file = await dataStore.create({
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
  location.search = `?directory=${directory}`;

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
  const directory = url.searchParams.get("directory");
  const offset = parseInt(request.headers.get("Upload-Offset") || "0");

  if (!directory) {
    return new Response("bucket name not provided", { status: 404 });
  }

  const dataStore = new FileStore({directory});

  if (!dataStore) {
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
    const newOffset = await dataStore.write(readable, fileId, offset);

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
  const directory = url.searchParams.get("directory");

  if (!fileId) {
    return new Response("File ID is required", { status: 400 });
  }

  if (!directory) {
    return new Response("bucket name not provided", { status: 404 });
  }

  const dataStore = new FileStore({directory});

  try {
    const file = await dataStore.getUpload(fileId);
    const uploadOffset = file.offset
    const uploadSize = file.size as number;
    let stringifyMetaData = ""
    if (file.metadata !== undefined) {
        stringifyMetaData = stringify(file.metadata);
    }

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

export function stringify(metadata: NonNullable<any>): string {
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
