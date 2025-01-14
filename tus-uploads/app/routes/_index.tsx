import { Form } from "@remix-run/react";
import { useState } from "react";
import * as tus from "tus-js-client";
export default function Index() {

  const [file, setFile] = useState(null as File | null);

  //EDIT THIS
  const bucketName = "you_bucket_name"

  const startuploadProcess = async (e:any) => {
    e.preventDefault();
    if (file) {
      // This will upload to a cloud storage buket
      await tusClientUploader(file, "/api/tus-cloud-uploads", bucketName);
      // this will upload to a directory on your file system
      
      // await tusClientUploader(file, "/api/tus-native-uploads", "./uploads/tus");
    }

  }

  async function tusClientUploader(file:File, endpoint: string, destination: string, title?: string) {
    let tusUpload:any;
    const metadata = {
      name: title || file.name,
      filename: file.name,
      filetype: file.type,
      contentType: file.type,
      destination,
    };
    return new Promise((resolve, reject) => {
      const options = {
        endpoint: endpoint,
        chunkSize: Infinity,
        metadata: metadata,
        onError(tusError:Error) {
          console.log({ tusError });
          reject({
            success: false,
            error: tusError,
            message: `error uploading file ${metadata.name}`,
          });
        },
        onSuccess() {
          console.log("onsuccess");
          const url = new URL(tusUpload.url);
          const id = url.pathname.split("/").pop();
          const bucketName = url.searchParams.get("bucket");
          if (bucketName) {
            const encodedFormat = encodeURIComponent(tusUpload.options.metadata.contentType);
            fetch(`/api/tus-cloud-uploads?id=${id}&mediaType=${encodedFormat}&bucketName=${bucketName}`)
            .then((response) => {
              return response.json();
            })
            .then((json) => {
              console.log({ json });
              resolve({
                success: true,
                url: url,
                id,
                fileUpdated: true,
              });
            })
            .catch((error) => {
              console.error({ error });
              resolve({
                success: true,
                url: url,
                id,
                fileUpdated: false,
                encodedFormat,
                bucketName,
              });
            });
          }


        },
        onProgress(bytesUploaded:number) {
          const progress = (bytesUploaded / file.size) * 100;
          console.log(progress + "%");
        },
      };
  
      tusUpload = new tus.Upload(file, options);
      console.log({ tusUpload });
      tusUpload.start();
    });
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Uploading Files using Tus Protocol</h1>
      <Form onSubmit={startuploadProcess}>
      <label className="btn-small btn-gray btn-trash flex justify-center items-center cursor-pointer btn-edit-image">
              <input
                type="file" onChange={(e) => {
                  const sellectFile = e.target.files ? e.target.files[0] : null;
                  setFile(sellectFile)
                }}
              />
            </label>
            <button type="submit">Upload File</button>
      </Form>
    </div>
  );
}
