// ===========================
// MEDIA BIAS DATABASE
// ===========================
export const indianMediaBias = {
  "the hindu": { bias: "center-left", credibility: "high", category: "newspaper" },
  "indian express": { bias: "center", credibility: "high", category: "newspaper" },
  "times of india": { bias: "center-right", credibility: "medium", category: "newspaper" },
  "hindustan times": { bias: "center", credibility: "high", category: "newspaper" },
  "the telegraph": { bias: "center-left", credibility: "high", category: "newspaper" },
  "deccan herald": { bias: "center-left", credibility: "medium", category: "newspaper" },
  "deccan chronicle": { bias: "center", credibility: "medium", category: "newspaper" },
  ndtv: { bias: "left", credibility: "high", category: "tv" },
  republic: { bias: "right", credibility: "medium", category: "tv" },
  "times now": { bias: "right", credibility: "medium", category: "tv" },
  "india today": { bias: "center", credibility: "high", category: "tv" },
  "aaj tak": { bias: "center", credibility: "high", category: "tv" },
  "zee news": { bias: "right", credibility: "medium", category: "tv" },
  "the wire": { bias: "left", credibility: "high", category: "online" },
  "scroll.in": { bias: "left", credibility: "high", category: "online" },
  thequint: { bias: "left", credibility: "medium", category: "online" },
  opindia: { bias: "right", credibility: "low", category: "online" },
  swarajya: { bias: "right", credibility: "medium", category: "online" },
  newslaundry: { bias: "center-left", credibility: "high", category: "online" },
  newsminute: { bias: "center-left", credibility: "high", category: "online" },
  print: { bias: "center", credibility: "high", category: "online" },
  "economic times": { bias: "center-right", credibility: "high", category: "business" },
  "business standard": { bias: "center", credibility: "high", category: "business" },
  "business today": { bias: "center", credibility: "high", category: "business" },
  mint: { bias: "center-right", credibility: "high", category: "business" },
  moneycontrol: { bias: "center", credibility: "high", category: "business" },
  sportstar: { bias: "center", credibility: "high", category: "sports" },
  cricbuzz: { bias: "center", credibility: "high", category: "sports" },
  "espn india": { bias: "center", credibility: "high", category: "sports" },
};

// ===========================
// CATEGORY DETECTION
// ===========================
export function detectCategory(title = "", description = "") {
  const text = (title + " " + description).toLowerCase();
  if (/player|football|cricket|match|sports|league|tournament/.test(text)) return "sports";
  if (/tech|ai|software|mobile|computer|digital/.test(text)) return "technology";
  if (/stock|market|business|economy|company|startup/.test(text)) return "business";
  return "general";
}

// ===========================
// KEYWORD EXTRACTION
// ===========================
const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "from","as","is","was","are","be","has","have","had","will","would","can",
  "could","may","might","should","this","that","these","those","it","its",
  "his","her","their","says","said","after","over","new","year","day","report",
]);

export function extractKeywords(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
}

// ===========================
// SOURCE DETECTION
// ===========================
export function detectSourceBiasFromName(sourceName = "") {
  const name = sourceName.toLowerCase();
  for (const [key, value] of Object.entries(indianMediaBias)) {
    if (name.includes(key)) return value;
  }
  return { bias: "center", credibility: "medium" };
}

export function extractDomainFromURL(url = "") {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    const domain = hostname.split(".")[0];
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return "Unknown Source";
  }
}

export function detectSourceFromURL(url = "") {
  if (!url) return null;
  const domain = url.toLowerCase();
  for (const [key, value] of Object.entries(indianMediaBias)) {
    if (domain.includes(key.replace(/\s+/g, ""))) {
      return { name: formatSourceName(key), ...value };
    }
  }
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    const sourceName = hostname.split(".")[0];
    return { name: formatSourceName(sourceName), bias: "center", credibility: "unknown" };
  } catch {
    return null;
  }
}

function formatSourceName(source) {
  return source.split(/[\s-]+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ===========================
// BIAS STATS CALCULATION
// ===========================
export function calculateBiasStats(sources = []) {
  let left = 0, center = 0, right = 0;
  sources.forEach(({ bias }) => {
    if (bias === "left" || bias === "center-left") left++;
    else if (bias === "center") center++;
    else if (bias === "right" || bias === "center-right") right++;
  });
  const total = Math.max(sources.length, 1);
  return {
    left: Math.round((left / total) * 100),
    center: Math.round((center / total) * 100),
    right: Math.round((right / total) * 100),
    counts: { left, center, right },
  };
}

// ===========================
// FIND SIMILAR ARTICLES
// ===========================
export function findSimilarArticles(article, allArticles = []) {
  const keywords = extractKeywords(article.title);
  return allArticles.filter((other) => {
    if (other.url === article.url) return false;
    const otherKw = extractKeywords(other.title);
    return keywords.filter((kw) => otherKw.includes(kw)).length >= 2;
  });
}

// ===========================
// ARTICLE BIAS (for cards)
// ===========================
export function calculateArticleBias(article, allArticles = []) {
  const similar = findSimilarArticles(article, allArticles);

  if (similar.length === 0) {
    const source = detectSourceFromURL(article.url);
    if (!source) return { left: 0, center: 100, right: 0, label: "Single source" };
    const { bias } = source;
    if (bias === "left" || bias === "center-left")
      return { left: 100, center: 0, right: 0, label: "Left-leaning coverage" };
    if (bias === "right" || bias === "center-right")
      return { left: 0, center: 0, right: 100, label: "Right-leaning coverage" };
    return { left: 0, center: 100, right: 0, label: "Centrist coverage" };
  }

  const sources = [article, ...similar]
    .map((a) => detectSourceFromURL(a.url))
    .filter(Boolean);
  const stats = calculateBiasStats(sources);
  const total = sources.length;

  let label =
    total === 1 ? "Single source"
    : stats.center >= 50 ? `${total} sources – Balanced`
    : stats.left > stats.right + 20 ? `${total} sources – Left-leaning`
    : stats.right > stats.left + 20 ? `${total} sources – Right-leaning`
    : `${total} sources – Mixed`;

  return { ...stats, label };
}

// ===========================
// CONVERT API DATA
// ===========================
export function convertApiData(apiArticles = []) {
  const formatted = apiArticles.map((a, i) => ({
    id: `article-${i}-${Date.now()}`,
    title: a.title || "Untitled",
    description: a.description || "",
    urlToImage: a.image || null,
    publishedAt: a.publishedAt,
    url: a.url,
    source: { name: a.source?.name || extractDomainFromURL(a.url) },
    category: detectCategory(a.title, a.description),
  }));

  return {
    "the-hindu": formatted.filter((_, i) => i % 3 === 0),
    "indian-express": formatted.filter((_, i) => i % 3 === 1),
    "times-of-india": formatted.filter((_, i) => i % 3 === 2),
  };
}

// ===========================
// CREATE HYBRID TRENDING
// ===========================
export function createHybridTrending(articles = []) {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  const top10 = sorted.slice(0, 10);

  return top10.map((article, index) => {
    const similar = findSimilarInDataset(article, articles);

    let badge, type;
    if (similar.length >= 8) { badge = "🔥 HOT"; type = "hot"; }
    else if (similar.length >= 3) { badge = "⭐ TRENDING"; type = "trending"; }
    else if (similar.length >= 2) { badge = "📍 MULTI-SOURCE"; type = "multi"; }
    else { badge = "🆕 NEW"; type = "new"; }

    const rawSources = similar.map((item) => {
      const name = item.source?.name || extractDomainFromURL(item.url);
      const biasInfo = detectSourceBiasFromName(name);
      return { name, ...biasInfo, url: item.url };
    });

    // Deduplicate
    const seen = new Set();
    const sources = rawSources.filter(({ name }) => {
      const key = name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return {
      id: `trending-${index}-${Date.now()}`,
      title: article.title,
      description: article.description || article.content || "",
      urlToImage: article.image || null,
      category: detectCategory(article.title, article.description || ""),
      publishedAt: article.publishedAt,
      badge,
      type,
      sourceCount: sources.length,
      originalSource: {
        name: article.source?.name || "News Source",
        url: article.url,
        date: new Date(article.publishedAt).toDateString(),
      },
      sources,
      hasBiasAnalysis: sources.length >= 2,
    };
  });
}

function findSimilarInDataset(target, all) {
  const targetKw = extractKeywords(target.title);
  const similar = all.filter((a) => {
    if (a.url === target.url) return false;
    const kw = extractKeywords(a.title);
    return targetKw.filter((k) => kw.includes(k)).length >= 2;
  });
  return [target, ...similar];
}

// ===========================
// BIAS INSIGHT TEXT
// ===========================
export function getBiasInsight(stats, totalSources) {
  if (stats.center >= 50)
    return "This story is being covered primarily by centrist outlets, suggesting broad mainstream interest.";
  if (stats.left > stats.right + 20)
    return "Left-leaning outlets are giving more attention to this story, which may indicate its relevance to progressive viewpoints.";
  if (stats.right > stats.left + 20)
    return "Right-leaning outlets are covering this story more prominently, suggesting conservative interest.";
  return "This story is receiving balanced coverage across the political spectrum.";
}

export function formatBiasLabel(bias = "") {
  return bias.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-");
}
