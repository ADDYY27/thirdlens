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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
      }}
    >
      <Masthead />

      <Navbar
        activeCategory={activeCategory}
        activeView={view}
        onSelectCategory={handleCategoryClick}
        onSelectView={(targetView) => {
          setView(targetView);
          setShowBookmarks(false);
          if (targetView === "trending") {
            loadTrending();
          }
        }}
        onOpenBookmarks={() => setShowBookmarks(true)}
        bookmarkCount={bookmarks.length}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onSearch={handleSearch}
        onShowAuth={() => setShowAuth(true)}
      />

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