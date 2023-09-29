import express from "express";
import { retrieveFiles } from "./src/storage-provider/web3storage/web3storage.js";
import { getFileType } from "./src/helpers/filetype.js";
import { checkVideo } from "./src/ai-models/video-verification/videoverify.js";
import { checkImage } from "./src/ai-models/image-verification/imageverify.js";
import { checkText } from "./src/ai-models/text-verification/textverify.js";
import {
  checkVerificationStatus,
  inputVerifyCID,
} from "./src/smart-contract/smartcontract.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://ucm-protocol.onrender.com/"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/process-data", async (req, res) => {
  const cid = req.body.inputString;

  try {
    // Process the input CID and retrieve files
    const processedData = await retrieveFiles(cid);

    // Prepare an array to hold the promises for processing each file
    const processingPromises = [];

    for (const file of processedData) {
      const fileType = getFileType(file._name);

      // Content Moderation Process based on file type
      const url = `https://${cid}.ipfs.w3s.link/${file._name}`;

      if (fileType === "video") {
        processingPromises.push(
          checkVideo(url, "https://secure-callback.onrender.com/webhook/")
        );
      } else if (fileType === "image") {
        processingPromises.push(inputVerifyCID(cid, await checkImage(url)));
      } else if (fileType === "text") {
        processingPromises.push(inputVerifyCID(cid, await checkText(url)));
      }
    }

    // Wait for all processing to complete
    await Promise.all(processingPromises);

    // Send the JSON response
    res.json({ message: "Processing completed successfully." });
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/check-cid", async (req, res) => {
  const cid = req.body.inputString;

  try {
    const data = JSON.parse(await checkVerificationStatus(cid));
    res.json({ data });
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error("Error:", error);
    res.status(500).json({ error: "CID unverified" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
