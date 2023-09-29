import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function checkImage(url) {
  return axios
    .get("https://api.sightengine.com/1.0/check.json", {
      params: {
        url,
        models: "nudity-2.0,wad,tobacco",
        api_user: process.env.SIGHTENGINE_API_USER,
        api_secret: process.env.SIGHTENGINE_API_SECRET,
      },
    })
    .then(function (response) {
      // on success: handle response
      return response.data;
    })
    .catch(function (error) {
      // handle error
      if (error.response) return error.response.data;
      else return error.message;
    });
}
