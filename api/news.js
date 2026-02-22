export default async function handler(req, res) {
  const { endpoint, ...params } = req.query;

  const API_KEY = "340ef39acc42bcdc796c18d337c536fb";
  const BASE_URL = "https://gnews.io/api/v4";

  const queryString = new URLSearchParams({
    ...params,
    token: API_KEY,
  }).toString();

  const url = `${BASE_URL}/${endpoint}?${queryString}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}