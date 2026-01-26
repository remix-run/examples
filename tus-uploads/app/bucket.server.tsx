import {Storage} from "@google-cloud/storage"


export function getCloudStorage() {
  const projectId = "";

  let private_key = ''
  const private_key_string = process.env.PRIVATE_KEY_GOOGLE || "";
  if (private_key_string.length) {
    private_key = private_key_string.split(String.raw`\n`).join("\n");
  }
  return new Storage({
    projectId,
    credentials: {
      type: "",
      project_id: "",
      private_key_id: "",
      private_key: `-----BEGIN PRIVATE KEY-----\n${private_key}\n-----END PRIVATE KEY-----\n`,
      client_email: "",
      client_id: "",
      universe_domain: "",
    },
  });
}
