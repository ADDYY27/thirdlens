let cache = {
  headlines: null,
  trending: null,
};

const CACHE_TTL = 10 * 60 * 1000;

export default async function handler(req, res) {
  const { endpoint, ...params } = req.query;

  // Only allow supported GNews endpoints
  if (endpoint !== "top-headlines") {
    return res.status(400).json({
      error: "Invalid news endpoint",
    });
  }

  const API_KEY = process.env.GNEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "GNEWS_API_KEY is not configured.",
    });
  }

  const BASE_URL = "https://gnews.io/api/v4";

  const queryString = new URLSearchParams({
    ...params,
    token: API_KEY,
  }).toString();

  const url =
    `${BASE_URL}/${endpoint}?${queryString}`;

  const isTrending =
    params.max === "25" ||
    params.max === "50";

  const cacheKey = isTrending
    ? "trending"
    : "headlines";

  try {
    const response = await fetch(url);

    const data = await response.json();

    // ───────────────────────────────────────
    // GNEWS RATE LIMIT
    // ───────────────────────────────────────

    if (response.status === 429) {
      const cached = cache[cacheKey];

      if (
        cached &&
        Date.now() - cached.timestamp < CACHE_TTL
      ) {
        res.setHeader(
          "X-ThirdLens-Cache",
          "rate-limit-fallback"
        );

        return res.status(200).json({
          ...cached.data,
          cached: true,
          rateLimited: true,
        });
      }

      return res.status(429).json({
        error:
          "GNews rate limit reached. Please try again later.",
        status: 429,
      });
    }

    // ───────────────────────────────────────
    // OTHER API ERRORS
    // ───────────────────────────────────────

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.errors?.[0] ||
          data?.error ||
          "GNews request failed.",
        status: response.status,
      });
    }

    // ───────────────────────────────────────
    // SUCCESS
    // ───────────────────────────────────────

    cache[cacheKey] = {
      timestamp: Date.now(),
      data,
    };

    res.setHeader(
      "X-ThirdLens-Cache",
      "fresh"
    );

    return res.status(200).json(data);
  } catch (error) {
    console.error("GNews proxy error:", error);

    return res.status(500).json({
      error: "Failed to fetch news.",
    });
  }
}