// Import the 'sightengine' module using ES modules
import sightengine from "sightengine";

// Initialize the 'sightengine' instance
const client = new sightengine(
  process.env.SIGHTENGINE_API_USER,
  process.env.SIGHTENGINE_API_SECRET
);

// Function to check a video for tobacco content
export async function checkVideo(url, callbackurl) {
  try {
    const result = await client.check(["tobacco"]).video(url, callbackurl);
    // The API response (result)
    console.log(result);
  } catch (error) {
    // Handle error
    console.error(error);
  }
}
