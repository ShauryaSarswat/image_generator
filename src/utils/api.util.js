const axios = require("axios");

exports.callTextToImageAPI = async ({ prompt, style_id = 4, size = "1-1" }) => {
  const response = await axios.post(
    "https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php",
    { prompt, style_id, size },
    {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": process.env.RAPIDAPI_HOST,
        "Content-Type": "application/json",
      },
      responseType: "json",
    }
  );
  const results = response.data?.final_result;
  if (!results || !results.length) throw new Error("No image returned from API");
  return results[0].origin;
};