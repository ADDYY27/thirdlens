import { convertApiData, createHybridTrending } from "../utils/newsUtils";

// On localhost: calls GNews directly
// On Vercel: calls via /api/news proxy to avoid CORS
const IS_LOCAL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_KEY = "340ef39acc42bcdc796c18d337c536fb";
const DIRECT_URL = "https://gnews.io/api/v4";

function buildUrl(params) {
  if (IS_LOCAL) {
    const qs = new URLSearchParams({ ...params, token: API_KEY }).toString();
    return `${DIRECT_URL}/top-headlines?${qs}`;
  } else {
    const qs = new URLSearchParams({ endpoint: "top-headlines", ...params }).toString();
    return `/api/news?${qs}`;
  }
}

export async function fetchTopHeadlines() {
  const url = buildUrl({ country: "in", lang: "en" });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data.articles?.length) throw new Error("No articles found");
  return convertApiData(data.articles);
}

export async function fetchTrendingTopics() {
  const url = buildUrl({ country: "in", lang: "en", max: "50" });
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const data = await res.json();
  if (!data.articles?.length) throw new Error("No articles returned");
  return createHybridTrending(data.articles);
}