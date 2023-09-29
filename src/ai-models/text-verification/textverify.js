// Import axios and FormData
import axios from "axios";
import FormData from "form-data";

// Exported asynchronous function
export async function checkText(url) {
  try {
    // Fetch the inputText from the URL
    const response = await axios.get(url);

    const inputText = response.data; // Assuming the response contains the text

    const data = new FormData();
    data.append("text", inputText);
    data.append("lang", "en");
    data.append("mode", "ml");
    data.append("api_user", process.env.SIGHTENGINE_API_USER);
    data.append("api_secret", process.env.SIGHTENGINE_API_SECRET);

    const textCheckResponse = await axios({
      url: "https://api.sightengine.com/1.0/text/check.json",
      method: "post",
      data: data,
      headers: data.getHeaders(),
    });

    // On success: handle textCheckResponse
    return textCheckResponse.data;
  } catch (error) {
    // Handle error
    if (error.response) console.log(error.response.data);
    else console.log(error.message);
  }
}
