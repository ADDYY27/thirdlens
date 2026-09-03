const NAV_CATEGORIES = [
  "general",
  "technology",
  "sports",
  "business",
];

export default function Navbar({
  activeCategory,
  onCategoryClick,
  onShowTrending,
  onShowBookmarks,
  bookmarkCount,
  searchInput,
  onSearchInputChange,
  onSearch,
}) {
  const navButtonStyle = (active = false) => ({
    padding: "8px 15px",
    background: active
      ? "rgba(167,122,53,0.07)"
      : "transparent",
    border: active
      ? "1px solid rgba(167,122,53,0.38)"
      : "1px solid transparent",
    borderRadius: "2px",

    color: active ? "#8f672d" : "#28241e",

    fontFamily:
      '"Cormorant Garamond", Georgia, serif',

    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",

    cursor: "pointer",
    transition: "all 0.2s ease",

    whiteSpace: "nowrap",
  });

  return (
    <nav
      style={{
        background: "rgba(250,247,239,0.97)",
        borderBottom: "1px solid rgba(130,95,42,0.28)",
        position: "sticky",
        top: 0,
        zIndex: 100,

        boxShadow: "0 1px 8px rgba(60,40,10,0.04)",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Main navbar row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            flexWrap: "wrap",
            gap: "10px",

            padding: "10px 0 8px",
          }}
        >
          {/* LEFT NAVIGATION */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              flexWrap: "wrap",
            }}
          >
            {/* Categories */}
            {NAV_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="navbar-font"
                onClick={() => onCategoryClick(cat)}
                style={navButtonStyle(activeCategory === cat)}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.color = "#8f672d";
                    e.currentTarget.style.background =
                      "rgba(167,122,53,0.045)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.color = "#28241e";
                    e.currentTarget.style.background =
                      "transparent";
                  }
                }}
              >
                {cat}
              </button>
            ))}

            {/* Divider */}
            <div
              style={{
                width: "1px",
                height: "24px",

                background:
                  "rgba(130,95,42,0.28)",

                margin: "0 10px",
              }}
            />

            {/* Opinion */}
            <button
              className="navbar-font"
              onClick={onShowTrending}
              style={navButtonStyle()}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#8f672d";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#28241e";
              }}
            >
              <span style={{ marginRight: "6px" }}>
                ✍
              </span>
              Opinion
            </button>

            {/* Trending */}
            <button
              className="navbar-font"
              onClick={onShowTrending}
              style={navButtonStyle()}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#8f672d";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#28241e";
              }}
            >
              <span style={{ marginRight: "6px" }}>
                🔥
              </span>
              Trending
            </button>

            {/* Bookmarks */}
           {/* Bookmarks */}
<button
  className="navbar-font"
  onClick={onShowBookmarks}
  style={{
    ...navButtonStyle(bookmarkCount > 0),
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: bookmarkCount > 0 ? "#8f672d" : "#29251f",
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontWeight: 600,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = "#8f672d";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color =
      bookmarkCount > 0 ? "#8f672d" : "#29251f";
  }}
>
  <span>📌</span>

  <span>Bookmarks</span>

  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "19px",
      height: "15px",
      padding: "0 5px",
      background: "#a77a35",
      color: "#fffaf0",
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: "8px",
      fontWeight: 600,
      borderRadius: "9px",
    }}
  >
    {bookmarkCount}
  </span>
</button>
          </div>
        </div>

        {/* SEARCH ROW */}
        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: "8px",

            paddingBottom: "10px",
          }}
        >
          {/* Search input */}
          <input
            type="text"
            value={searchInput}
            onChange={(e) =>
              onSearchInputChange(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && onSearch()
            }
            placeholder="Search articles..."
            style={{
              width: "220px",

              padding: "8px 13px",

              background:
                "rgba(255,255,255,0.38)",

              border:
                "1px solid rgba(130,95,42,0.34)",

              borderRadius: "2px",

              color: "#171512",

              fontFamily:
                '"IBM Plex Mono", "Courier New", monospace',

              fontSize: "9px",

              outline: "none",

              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border =
                "1px solid rgba(130,95,42,0.65)";

              e.currentTarget.style.background =
                "rgba(255,255,255,0.65)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border =
                "1px solid rgba(130,95,42,0.34)";

              e.currentTarget.style.background =
                "rgba(255,255,255,0.38)";
            }}
          />

          {/* Search button */}
          <button
            onClick={onSearch}
            style={{
              padding: "9px 20px",

              background: "#a77a35",

              border: "none",
              borderRadius: "2px",

              color: "#fff9ed",

              fontFamily:
                '"IBM Plex Mono", monospace',

              fontSize: "8px",
              fontWeight: 600,

              letterSpacing: "0.13em",

              textTransform: "uppercase",

              cursor: "pointer",

              transition:
                "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "#8f672d";

              e.currentTarget.style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "#a77a35";

              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            Search
          </button>
        </div>
      </div>
    </nav>
  );
}