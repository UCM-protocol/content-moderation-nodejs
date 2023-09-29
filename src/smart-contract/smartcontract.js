import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();
import contractABI from "./CIDVerifier.json" assert { type: "json" };
const contractAddress = process.env.VERIFICATION_CONTRACT_ADDRESS;
const privateKey = process.env.CONTRACT_OWNER_PK;
const providerUrl = process.env.FILECOIN_WSS_PROVIDER;
const providerNetworkId = 314159;

// Validate that required environment variables are set
if (!contractAddress || !privateKey) {
  console.error(
    "Missing contract address or private key in environment variables."
  );
  process.exit(1);
}

export async function inputVerifyCID(cid, receive) {
  try {
    if (!cid) {
      console.error("Invalid CID in the request.");
      response.status(400).json({ error: "Invalid CID" });
      return;
    }

    const provider = new ethers.WebSocketProvider(
      providerUrl,
      providerNetworkId
    );

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const data = JSON.stringify(receive);

    // Build the transaction
    const tx = await contract.verifyCID(cid, data);

    console.log("Transaction Hash:", tx.hash);
    await tx.wait();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export async function checkVerificationStatus(cid) {
  try {
    if (!cid) {
      console.error("Invalid CID in the request.");
      return "Invalid CID";
    }

    const provider = new ethers.WebSocketProvider(
      providerUrl,
      providerNetworkId
    ); // Use JsonRpcProvider for reading data

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Call the contract's `verifiedCIDs` function to get the verification status
    const verificationStatus = await contract.verifiedCIDs(cid);

    return verificationStatus;
  } catch (error) {
    console.error("Error:", error.message);
    return "Error occurred";
  }
}
