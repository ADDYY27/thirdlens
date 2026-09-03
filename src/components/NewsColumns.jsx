import NewsCard from "./NewsCard";

const SOURCE_BIAS_LABELS = {
  "the-hindu": {
    lean: "Center-Left",
    dot: "#5b91c9",
  },
  "indian-express": {
    lean: "Center",
    dot: "#5baf83",
  },
  "times-of-india": {
    lean: "Center-Right",
    dot: "#e98a4b",
  },
};

export default function NewsColumns({
  sources,
  articles,
  onCardClick,
  onToggleBookmark,
  isBookmarked,
  getBias,
}) {
  return (
    <div className="news-col-grid">
      {sources.map(({ id, label }, colIdx) => {
        const list = articles[id] || [];

        const meta =
          SOURCE_BIAS_LABELS[id] || {
            lean: "Center",
            dot: "#5baf83",
          };

        return (
          <section
            key={id}
            style={{
              animation: `fadeUp 0.5s ease ${colIdx * 0.1}s both`,
            }}
          >
            {/* =====================================================
                SOURCE HEADER
            ===================================================== */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                {/* Source dot */}
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: meta.dot,
                    display: "block",
                  }}
                />

                {/* Source name */}
                <h2
                  className="source-heading"
                  style={{
                    fontSize: "29px",
                    fontWeight: 600,
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {label}
                </h2>
              </div>

              {/* Source meta */}
              <p
                className="source-meta"
                style={{
                  marginBottom: "10px",
                }}
              >
                {meta.lean} · Indian News Source
              </p>

              <hr className="gold-rule" />
            </div>

            {/* =====================================================
                BREAKING NEWS
            ===================================================== */}
            {list.length > 0 && (
              <div
                className="breaking-card"
                style={{
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                {/* Breaking label */}
                <p
                  className="breaking-label"
                  style={{
                    marginBottom: "12px",
                  }}
                >
                  🔥 Breaking Today
                </p>

                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {list.slice(0, 3).map((a) => (
                    <li
                      key={a.id}
                      className="breaking-item"
                      onClick={() => onCardClick(a)}
                      style={{
                        cursor: "pointer",
                        paddingLeft: "14px",
                        position: "relative",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#8f672d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "";
                      }}
                    >
                      {/* Arrow */}
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "rgba(167,122,53,0.7)",
                          fontWeight: 600,
                        }}
                      >
                        ›
                      </span>

                      {a.title?.length > 70
                        ? a.title.substring(0, 70) + "…"
                        : a.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* =====================================================
                NEWS CARDS
            ===================================================== */}
            {list.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "var(--ink-muted)",
                }}
              >
                <p
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "12px",
                  }}
                >
                  📰
                </p>

                <p
                  className="mono"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    color: "var(--ink-muted)",
                  }}
                >
                  No articles in this category
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {list.map((article, i) => (
                  <div
                    key={article.id}
                    style={{
                      animation: `fadeUp 0.4s ease ${
                        i * 0.07
                      }s both`,
                    }}
                  >
                    <NewsCard
                      article={article}
                      onCardClick={onCardClick}
                      onToggleBookmark={onToggleBookmark}
                      isBookmarked={isBookmarked}
                      getBias={getBias}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}