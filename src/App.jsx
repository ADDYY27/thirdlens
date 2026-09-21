import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthProvider } from "./context/AuthContext";
import Masthead from "./components/Masthead";
import Navbar from "./components/Navbar";
import NewsColumns from "./components/NewsColumns";
import BookmarksPanel from "./components/BookmarksPanel";
import TrendingPage from "./components/TrendingPage";
import DetailPage from "./components/DetailPage";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import AuthModal from "./components/AuthModal";
import UserMenu from "./components/UserMenu";
import OpinionPage from "./pages/OpinionPage";
import { fetchTopHeadlines, fetchTrendingTopics } from "./services/newsApi";
import { calculateArticleBias } from "./utils/newsUtils";

const SOURCE_CONFIG = [
  { id: "the-hindu", label: "The Hindu" },
  { id: "indian-express", label: "Indian Express" },
  { id: "times-of-india", label: "Times of India" },
];

const EMPTY_ARTICLES = {
  "the-hindu": [],
  "indian-express": [],
  "times-of-india": [],
};

function AppInner() {
  const [articles, setArticles] = useState(EMPTY_ARTICLES);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [view, setView] = useState("home");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [previousView, setPreviousView] = useState("home");
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trendingError, setTrendingError] = useState(null);

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("newsBookmarks") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("newsBookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const loadNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setArticles(await fetchTopHeadlines());
    } catch (err) {
      setError(err.message || "Failed to load news.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTrending = useCallback(
    async (force = false) => {
      if (trendingArticles.length > 0 && !force) return;

      setIsTrendingLoading(true);
      setTrendingError(null);

      try {
        setTrendingArticles(await fetchTrendingTopics());
      } catch (err) {
        setTrendingError(err.message || "Failed to load trending.");
      } finally {
        setIsTrendingLoading(false);
      }
    },
    [trendingArticles.length]
  );

useEffect(() => {
  loadNews();
}, [loadNews]);
  const allArticles = useMemo(
    () => Object.values(articles).flat(),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const result = {};

    SOURCE_CONFIG.forEach(({ id }) => {
      let list = articles[id] || [];

      if (activeCategory !== "general") {
        list = list.filter((a) => a.category === activeCategory);
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();

        list = list.filter(
          (a) =>
            a.title?.toLowerCase().includes(q) ||
            a.description?.toLowerCase().includes(q)
        );
      }

      result[id] = list;
    });

    return result;
  }, [articles, activeCategory, searchQuery]);

  const toggleBookmark = useCallback((article) => {
    setBookmarks((prev) =>
      prev.find((b) => b.url === article.url)
        ? prev.filter((b) => b.url !== article.url)
        : [...prev, article]
    );
  }, []);

  const isBookmarked = useCallback(
    (article) => bookmarks.some((b) => b.url === article.url),
    [bookmarks]
  );

  const getBias = useCallback(
    (article) => calculateArticleBias(article, allArticles),
    [allArticles]
  );

  const openDetail = useCallback((article, fromView = "home") => {
    setPreviousView(fromView);
    setSelectedArticle(article);
    setView("detail");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const closeDetail = useCallback(() => {
    setView(previousView);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [previousView]);

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput.trim());
    setView("home");
    setShowBookmarks(false);
  }, [searchInput]);

  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory(cat);
    setSearchQuery("");
    setSearchInput("");
    setView("home");
    setShowBookmarks(false);
  }, []);

  const NAV_ITEMS = ["general", "technology", "sports", "business"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
      }}
    >
      <Masthead />

      {/* Navigation */}
      {/* Navigation */}
<nav className="site-navbar">
  <div className="site-navbar-inner">
    <div className="site-navbar-links">

      {NAV_ITEMS.map((cat) => (
        <button
          key={cat}
          className="navbar-font"
          onClick={() => handleCategoryClick(cat)}
          style={{
            padding: "7px 16px",
            background:
              activeCategory === cat && view === "home"
                ? "rgba(167,122,53,0.07)"
                : "transparent",
            border:
              activeCategory === cat && view === "home"
                ? "1px solid rgba(167,122,53,0.38)"
                : "1px solid transparent",
            borderRadius: "2px",
            color:
              activeCategory === cat && view === "home"
                ? "#8f672d"
                : "#29251f",
            fontFamily:
              '"Outfit", sans-serif',
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!(activeCategory === cat && view === "home")) {
              e.currentTarget.style.color = "#8f672d";
              e.currentTarget.style.background =
                "rgba(167,122,53,0.045)";
            }
          }}
          onMouseLeave={(e) => {
            if (!(activeCategory === cat && view === "home")) {
              e.currentTarget.style.color = "#29251f";
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          {cat}
        </button>
      ))}

      <span className="navbar-divider" />

      {/* Opinion */}
      <button
        className="navbar-font"
        onClick={() => {
          setView("opinion");
          setShowBookmarks(false);
        }}
        style={{
          padding: "7px 16px",
          background:
            view === "opinion"
              ? "rgba(167,122,53,0.07)"
              : "transparent",
          border:
            view === "opinion"
              ? "1px solid rgba(167,122,53,0.38)"
              : "1px solid transparent",
          borderRadius: "2px",
          color:
            view === "opinion"
              ? "#8f672d"
              : "#29251f",
          fontFamily:
            '"Outfit", sans-serif',
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
      >
        ✍ Opinion
      </button>

      {/* Trending */}
      <button
        className="navbar-font"
        onClick={() => {
          setView("trending");
          setShowBookmarks(false);
          loadTrending();
        }}
        style={{
          padding: "7px 16px",
          background:
            view === "trending"
              ? "rgba(167,122,53,0.07)"
              : "transparent",
          border:
            view === "trending"
              ? "1px solid rgba(167,122,53,0.38)"
              : "1px solid transparent",
          borderRadius: "2px",
          color:
            view === "trending"
              ? "#8f672d"
              : "#29251f",
          fontFamily:
            '"Outfit", sans-serif',
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
      >
        🔥 Trending
      </button>

      {/* Bookmarks */}
      <button
        className="navbar-font"
        onClick={() => setShowBookmarks(true)}
        style={{
          padding: "7px 15px",
          background:
            showBookmarks || bookmarks.length > 0
              ? "rgba(167,122,53,0.07)"
              : "transparent",
          border:
            showBookmarks || bookmarks.length > 0
              ? "1px solid rgba(167,122,53,0.38)"
              : "1px solid transparent",
          borderRadius: "2px",
          color:
            showBookmarks || bookmarks.length > 0
              ? "#8f672d"
              : "#29251f",
          fontFamily:
            '"Outfit", sans-serif',
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: "7px",
        }}
      >
        <span>📌</span>

        <span style={{ color: "inherit" }}>
          Bookmarks
        </span>

        <span className="bookmark-count">
          {bookmarks.length}
        </span>
      </button>
    </div>

    {/* Search + User */}
    <div className="site-navbar-search">

      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Search articles..."
        aria-label="Search articles"
      />

      <button
        className="search-button"
        onClick={handleSearch}
      >
        Search
      </button>

      <UserMenu
        onShowAuth={() => setShowAuth(true)}
      />
    </div>
  </div>
</nav>

      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {showBookmarks && (
          <BookmarksPanel
            bookmarks={bookmarks}
            onClose={() => setShowBookmarks(false)}
            onOpenDetail={(a) => openDetail(a, "home")}
            onToggleBookmark={toggleBookmark}
            isBookmarked={isBookmarked}
            getBias={getBias}
          />
        )}

        {view === "detail" && selectedArticle && (
          <DetailPage
            article={selectedArticle}
            allArticles={allArticles}
            onBack={closeDetail}
          />
        )}

        {view === "trending" && (
          <TrendingPage
            articles={trendingArticles}
            isLoading={isTrendingLoading}
            error={trendingError}
            onBack={() => setView("home")}
            onRetry={() => {
              setTrendingArticles([]);
              loadTrending(true);
            }}
            onOpenDetail={(a) => openDetail(a, "trending")}
            onToggleBookmark={toggleBookmark}
            isBookmarked={isBookmarked}
          />
        )}

        {view === "opinion" && (
          <OpinionPage
            onShowAuth={() => setShowAuth(true)}
          />
        )}

        {view === "home" && (
          <>
            {isLoading && <LoadingState />}

            {error && !isLoading && (
              <ErrorState
                message={error}
                onRetry={loadNews}
              />
            )}

            {!isLoading && !error && (
              <NewsColumns
                sources={SOURCE_CONFIG}
                articles={filteredArticles}
                allArticles={allArticles}
                onCardClick={(a) => openDetail(a, "home")}
                onToggleBookmark={toggleBookmark}
                isBookmarked={isBookmarked}
                getBias={getBias}
              />
            )}
          </>
        )}
      </main>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}