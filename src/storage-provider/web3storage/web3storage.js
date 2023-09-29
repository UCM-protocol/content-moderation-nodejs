import { Web3Storage } from "web3.storage";
import dotenv from "dotenv";
dotenv.config();

function getAccessToken() {
  // Replace 'YOUR_API_TOKEN' with your actual API token from web3.storage
  return process.env.W3STORAGE_ACCESS_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export async function retrieveFiles(cid) {
  const client = makeStorageClient();

  try {
    const res = await client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);

    if (!res.ok) {
      throw new Error(
        `Failed to get ${cid} - [${res.status}] ${res.statusText}`
      );
    }

    // Unpack File objects from the response
    const files = await res.files();
    return files;
  } catch (error) {
    console.error("Error retrieving files:", error);
  }
}
