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
const EMPTY_ARTICLES = { "the-hindu":[], "indian-express":[], "times-of-india":[] };

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
    try { return JSON.parse(localStorage.getItem("newsBookmarks") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("newsBookmarks", JSON.stringify(bookmarks)); }, [bookmarks]);

  const loadNews = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setArticles(await fetchTopHeadlines()); }
    catch (err) { setError(err.message || "Failed to load news."); }
    finally { setIsLoading(false); }
  }, []);

  const loadTrending = useCallback(async (force=false) => {
    if (trendingArticles.length > 0 && !force) return;
    setIsTrendingLoading(true); setTrendingError(null);
    try { setTrendingArticles(await fetchTrendingTopics()); }
    catch (err) { setTrendingError(err.message || "Failed to load trending."); }
    finally { setIsTrendingLoading(false); }
  }, [trendingArticles.length]);

  useEffect(() => { loadNews().then(() => loadTrending()); }, []);

  const allArticles = useMemo(() => Object.values(articles).flat(), [articles]);

  const filteredArticles = useMemo(() => {
    const result = {};
    SOURCE_CONFIG.forEach(({ id }) => {
      let list = articles[id] || [];
      if (activeCategory !== "general") list = list.filter(a => a.category === activeCategory);
      if (searchQuery) { const q = searchQuery.toLowerCase(); list = list.filter(a => a.title?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)); }
      result[id] = list;
    });
    return result;
  }, [articles, activeCategory, searchQuery]);

  const toggleBookmark = useCallback((article) => {
    setBookmarks(prev => prev.find(b => b.url === article.url) ? prev.filter(b => b.url !== article.url) : [...prev, article]);
  }, []);
  const isBookmarked = useCallback((article) => bookmarks.some(b => b.url === article.url), [bookmarks]);
  const getBias = useCallback((article) => calculateArticleBias(article, allArticles), [allArticles]);

  const openDetail = useCallback((article, fromView="home") => {
    setPreviousView(fromView); setSelectedArticle(article); setView("detail");
    window.scrollTo({ top:0, behavior:"smooth" });
  }, []);
  const closeDetail = useCallback(() => { setView(previousView); window.scrollTo({ top:0, behavior:"smooth" }); }, [previousView]);

  const handleSearch = useCallback(() => { setSearchQuery(searchInput.trim()); setView("home"); setShowBookmarks(false); }, [searchInput]);
  const handleCategoryClick = useCallback((cat) => { setActiveCategory(cat); setSearchQuery(""); setSearchInput(""); setView("home"); setShowBookmarks(false); }, []);

  const NAV_ITEMS = ["general","technology","sports","business"];

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a" }}>
      <Masthead />

      {/* Enhanced Navbar with Opinion + UserMenu */}
      <nav style={{ background:"linear-gradient(180deg,#111111,#0d0d0d)", borderBottom:"1px solid rgba(200,151,58,0.25)", position:"sticky", top:0, zIndex:100, boxShadow:"0 4px 32px rgba(0,0,0,0.6)" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"0 24px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", padding:"14px 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"4px", flexWrap:"wrap" }}>
              {NAV_ITEMS.map(cat => (
                <button key={cat} onClick={() => handleCategoryClick(cat)}
                  style={{ padding:"7px 16px", background: activeCategory===cat&&view==="home"?"rgba(200,151,58,0.15)":"transparent", border: activeCategory===cat&&view==="home"?"1px solid rgba(200,151,58,0.5)":"1px solid transparent", borderRadius:"3px", color: activeCategory===cat&&view==="home"?"#c8973a":"#9a9090", fontFamily:"'Courier New',monospace", fontSize:"11px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e=>{ if(!(activeCategory===cat&&view==="home")){ e.target.style.color="#c8973a"; }}}
                  onMouseLeave={e=>{ if(!(activeCategory===cat&&view==="home")){ e.target.style.color="#9a9090"; }}}
                >{cat}</button>
              ))}
              <div style={{ width:"1px",height:"24px",background:"rgba(200,151,58,0.2)",margin:"0 8px" }} />
              <button onClick={()=>{ setView("opinion"); setShowBookmarks(false); }}
                style={{ padding:"7px 16px", background: view==="opinion"?"rgba(200,151,58,0.15)":"transparent", border: view==="opinion"?"1px solid rgba(200,151,58,0.5)":"1px solid transparent", borderRadius:"3px", color: view==="opinion"?"#c8973a":"#9a9090", fontFamily:"'Courier New',monospace", fontSize:"11px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e=>{ if(view!=="opinion") e.target.style.color="#c8973a"; }}
                onMouseLeave={e=>{ if(view!=="opinion") e.target.style.color="#9a9090"; }}
              >✍ Opinion</button>
              <button onClick={()=>{ setView("trending"); setShowBookmarks(false); loadTrending(); }}
                style={{ padding:"7px 16px",background:"transparent",border:"1px solid transparent",borderRadius:"3px",color:"#e8b85a",fontFamily:"'Courier New',monospace",fontSize:"11px",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(232,184,90,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >🔥 Trending</button>
              <button onClick={()=>setShowBookmarks(true)}
                style={{ padding:"7px 16px",background: bookmarks.length>0?"rgba(200,151,58,0.08)":"transparent",border: bookmarks.length>0?"1px solid rgba(200,151,58,0.3)":"1px solid transparent",borderRadius:"3px",color:"#c8973a",fontFamily:"'Courier New',monospace",fontSize:"11px",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:"8px" }}
              >
                📌 Bookmarks
                <span style={{ background:"#c8973a",color:"#0a0a0a",fontSize:"10px",fontWeight:900,padding:"1px 7px",borderRadius:"10px",minWidth:"20px",textAlign:"center" }}>{bookmarks.length}</span>
              </button>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
              <input type="text" value={searchInput} onChange={e=>setSearchInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch()} placeholder="Search articles…"
                style={{ width:"200px",padding:"8px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(200,151,58,0.25)",borderRadius:"3px",color:"#faf6ef",fontFamily:"'Courier New',monospace",fontSize:"12px",outline:"none",transition:"all 0.2s" }}
                onFocus={e=>{ e.target.style.border="1px solid rgba(200,151,58,0.6)"; e.target.style.background="rgba(200,151,58,0.05)"; }}
                onBlur={e=>{ e.target.style.border="1px solid rgba(200,151,58,0.25)"; e.target.style.background="rgba(255,255,255,0.05)"; }}
              />
              <button onClick={handleSearch}
                style={{ padding:"8px 20px",background:"linear-gradient(135deg,#c8973a,#e8b85a)",border:"none",borderRadius:"3px",color:"#0a0a0a",fontFamily:"'Courier New',monospace",fontSize:"11px",fontWeight:900,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 2px 12px rgba(200,151,58,0.3)" }}
              >Search</button>
              <UserMenu onShowAuth={() => setShowAuth(true)} />
            </div>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth:"1280px", margin:"0 auto", padding:"40px 24px 80px" }}>
        {showBookmarks && <BookmarksPanel bookmarks={bookmarks} onClose={()=>setShowBookmarks(false)} onOpenDetail={a=>openDetail(a,"home")} onToggleBookmark={toggleBookmark} isBookmarked={isBookmarked} getBias={getBias} />}
        {view==="detail" && selectedArticle && <DetailPage article={selectedArticle} allArticles={allArticles} onBack={closeDetail} />}
        {view==="trending" && <TrendingPage articles={trendingArticles} isLoading={isTrendingLoading} error={trendingError} onBack={()=>setView("home")} onRetry={()=>{ setTrendingArticles([]); loadTrending(true); }} onOpenDetail={a=>openDetail(a,"trending")} onToggleBookmark={toggleBookmark} isBookmarked={isBookmarked} />}
        {view==="opinion" && <OpinionPage onShowAuth={()=>setShowAuth(true)} />}
        {view==="home" && (
          <>
            {isLoading && <LoadingState />}
            {error && !isLoading && <ErrorState message={error} onRetry={loadNews} />}
            {!isLoading && !error && <NewsColumns sources={SOURCE_CONFIG} articles={filteredArticles} allArticles={allArticles} onCardClick={a=>openDetail(a,"home")} onToggleBookmark={toggleBookmark} isBookmarked={isBookmarked} getBias={getBias} />}
          </>
        )}
      </main>

      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} />}
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
