import {
  convertApiData,
  createHybridTrending,
} from "../utils/newsUtils";

const IS_LOCAL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const DIRECT_URL = "https://gnews.io/api/v4";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const CACHE_KEYS = {
  news: "thirdlens_news_cache",
  trending: "thirdlens_trending_cache",
};

// Prevent multiple identical requests at the same time
let newsRequest = null;
let trendingRequest = null;

// ─────────────────────────────────────────────
// CACHE HELPERS
// ─────────────────────────────────────────────

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) return null;

    const cached = JSON.parse(raw);

    if (!cached?.data) return null;

    return cached;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // Ignore localStorage errors
  }
}

function getFreshCache(key) {
  const cached = readCache(key);

  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL) {
    return null;
  }

  return cached.data;
}

function getLastCache(key) {
  return readCache(key)?.data || null;
}

// ─────────────────────────────────────────────
// URL
// ─────────────────────────────────────────────

function buildUrl(params) {
  if (IS_LOCAL) {
    const localKey = import.meta.env.VITE_GNEWS_API_KEY;

    if (!localKey) {
      throw new Error(
        "Missing VITE_GNEWS_API_KEY. Add it to your local .env file."
      );
    }

    const qs = new URLSearchParams({
      ...params,
      token: localKey,
    }).toString();

    return `${DIRECT_URL}/top-headlines?${qs}`;
  }

  const qs = new URLSearchParams({
    endpoint: "top-headlines",
    ...params,
  }).toString();

  return `/api/news?${qs}`;
}

// ─────────────────────────────────────────────
// FETCH NEWS
// ─────────────────────────────────────────────

export async function fetchTopHeadlines() {
  // 1. Use fresh cache immediately
  const freshCache = getFreshCache(CACHE_KEYS.news);

  if (freshCache) {
    return freshCache;
  }

  // 2. If request is already running, reuse it
  if (newsRequest) {
    return newsRequest;
  }

  newsRequest = (async () => {
    try {
      const url = buildUrl({
        country: "in",
        lang: "en",
      });

      const res = await fetch(url);

      // 3. Rate limit → use previous successful result
      if (res.status === 429) {
        const oldCache = getLastCache(CACHE_KEYS.news);

        if (oldCache?.length) {
          console.warn(
            "GNews rate limit reached. Using cached news."
          );

          return oldCache;
        }

        throw new Error(
          "GNews rate limit reached. Please try again later."
        );
      }

      if (!res.ok) {
        let message = `API Error: ${res.status}`;

        try {
          const errorData = await res.json();

          if (errorData?.error) {
            message = errorData.error;
          }
        } catch {
          // Ignore invalid error JSON
        }

        throw new Error(message);
      }

      const data = await res.json();

      if (!data.articles?.length) {
        throw new Error("No articles found");
      }

      const articles = convertApiData(data.articles);

      // 4. Save successful response
      writeCache(CACHE_KEYS.news, articles);

      return articles;
    } finally {
      newsRequest = null;
    }
  })();

  return newsRequest;
}

// ─────────────────────────────────────────────
// FETCH TRENDING
// ─────────────────────────────────────────────

export async function fetchTrendingTopics() {
  // 1. Use fresh cache
  const freshCache = getFreshCache(CACHE_KEYS.trending);

  if (freshCache) {
    return freshCache;
  }

  // 2. Deduplicate simultaneous requests
  if (trendingRequest) {
    return trendingRequest;
  }

  trendingRequest = (async () => {
    try {
      const url = buildUrl({
        country: "in",
        lang: "en",
        max: "25",
      });

      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 15000);

      let res;

      try {
        res = await fetch(url, {
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

      // 3. GNews 429 → previous successful trending
      if (res.status === 429) {
        const oldCache = getLastCache(
          CACHE_KEYS.trending
        );

        if (oldCache?.length) {
          console.warn(
            "GNews rate limit reached. Using cached trending."
          );

          return oldCache;
        }

        throw new Error(
          "GNews rate limit reached. Please try again later."
        );
      }

      if (!res.ok) {
        let message = `API Error: ${res.status}`;

        try {
          const errorData = await res.json();

          if (errorData?.error) {
            message = errorData.error;
          }
        } catch {
          // Ignore invalid error JSON
        }

        throw new Error(message);
      }

      const data = await res.json();

      if (!data.articles?.length) {
        throw new Error("No articles returned");
      }

      const trending = createHybridTrending(
        data.articles
      );

      // 4. Save successful response
      writeCache(
        CACHE_KEYS.trending,
        trending
      );

      return trending;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Trending request timed out."
        );
      }

      throw error;
    } finally {
      trendingRequest = null;
    }
  })();

  return trendingRequest;
}