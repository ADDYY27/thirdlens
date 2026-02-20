import { convertApiData, createHybridTrending } from "../utils/newsUtils";

const API_KEY = "340ef39acc42bcdc796c18d337c536fb";
const BASE_URL = "https://gnews.io/api/v4";

export async function fetchTopHeadlines() {
  const res = await fetch(
    `${BASE_URL}/top-headlines?country=in&lang=en&token=${API_KEY}`
  );
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data.articles?.length) throw new Error("No articles found");
  return convertApiData(data.articles);
}

export async function fetchTrendingTopics() {
  const res = await fetch(
    `${BASE_URL}/top-headlines?country=in&lang=en&max=50&token=${API_KEY}`,
    { signal: AbortSignal.timeout(15000) }
  );
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const data = await res.json();
  if (!data.articles?.length) throw new Error("No articles returned");
  return createHybridTrending(data.articles);
}
