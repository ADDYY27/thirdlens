import UserMenu from "./UserMenu";

const NAV_CATEGORIES = ["general", "technology", "sports", "business"];

export default function Navbar({
  activeCategory = "general",
  activeView = "home",
  onSelectCategory,
  onSelectView,
  onOpenBookmarks,
  bookmarkCount = 0,
  searchInput = "",
  onSearchChange,
  onSearch,
  onShowAuth,
}) {
  const isNavActive = (type, key) => {
    if (type === "category") return activeView === "home" && activeCategory === key;
    if (type === "view") return activeView === key;
    return false;
  };

  const getButtonStyle = (isActive) => ({
    padding: "7px 16px",
    background: isActive ? "rgba(167, 122, 53, 0.07)" : "transparent",
    border: isActive ? "1px solid rgba(167, 122, 53, 0.38)" : "1px solid transparent",
    borderRadius: "2px",
    color: isActive ? "#8f672d" : "#29251f",
    fontFamily: '"Outfit", sans-serif',
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  });

  return (
    <nav className="site-navbar">
      <div className="site-navbar-inner">
        {/* Navigation Links (LEFT GROUP) */}
        <div className="site-navbar-links">
          {NAV_CATEGORIES.map((cat) => {
            const active = isNavActive("category", cat);
            return (
              <button
                key={cat}
                className="navbar-font"
                onClick={() => onSelectCategory(cat)}
                style={getButtonStyle(active)}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "#8f672d";
                    e.currentTarget.style.background =
                      "rgba(167, 122, 53, 0.045)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "#29251f";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
                aria-current={active ? "page" : undefined}
              >
                {cat}
              </button>
            );
          })}

          <span className="navbar-divider" />

          {/* Opinion Button */}
          <button
            className="navbar-font"
            onClick={() => onSelectView("opinion")}
            style={getButtonStyle(isNavActive("view", "opinion"))}
            onMouseEnter={(e) => {
              if (activeView !== "opinion") {
                e.currentTarget.style.color = "#8f672d";
                e.currentTarget.style.background =
                  "rgba(167, 122, 53, 0.045)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== "opinion") {
                e.currentTarget.style.color = "#29251f";
                e.currentTarget.style.background = "transparent";
              }
            }}
            aria-current={activeView === "opinion" ? "page" : undefined}
          >
            ✍ Opinion
          </button>

          {/* Trending Button */}
          <button
            className="navbar-font"
            onClick={() => onSelectView("trending")}
            style={getButtonStyle(isNavActive("view", "trending"))}
            onMouseEnter={(e) => {
              if (activeView !== "trending") {
                e.currentTarget.style.color = "#8f672d";
                e.currentTarget.style.background =
                  "rgba(167, 122, 53, 0.045)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== "trending") {
                e.currentTarget.style.color = "#29251f";
                e.currentTarget.style.background = "transparent";
              }
            }}
            aria-current={activeView === "trending" ? "page" : undefined}
          >
            🔥 Trending
          </button>

          {/* Bookmarks Drawer Trigger */}
          <button
            className="navbar-font"
            onClick={onOpenBookmarks}
            style={{
              ...getButtonStyle(bookmarkCount > 0),
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
            onMouseEnter={(e) => {
              if (bookmarkCount === 0) {
                e.currentTarget.style.color = "#8f672d";
                e.currentTarget.style.background =
                  "rgba(167, 122, 53, 0.045)";
              }
            }}
            onMouseLeave={(e) => {
              if (bookmarkCount === 0) {
                e.currentTarget.style.color = "#29251f";
                e.currentTarget.style.background = "transparent";
              }
            }}
            aria-label={`Open bookmarks, ${bookmarkCount} saved`}
          >
            <span>📌</span>
            <span style={{ color: "inherit" }}>Bookmarks</span>
            <span className="bookmark-count">{bookmarkCount}</span>
          </button>
        </div>

        {/* Search & User Session Controls (RIGHT GROUP) */}
        <div className="site-navbar-search">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            placeholder="Search articles..."
            aria-label="Search articles"
          />

          <button className="search-button" onClick={onSearch}>
            Search
          </button>

          <UserMenu onShowAuth={onShowAuth} />
        </div>
      </div>
    </nav>
  );
}
