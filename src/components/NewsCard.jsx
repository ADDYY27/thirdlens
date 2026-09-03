export default function NewsCard({
  article,
  onCardClick,
  onToggleBookmark,
  isBookmarked,
  getBias,
}) {
  const saved = isBookmarked(article);

  const bias = getBias
    ? getBias(article)
    : {
        left: 0,
        center: 100,
        right: 0,
        label: "Single source",
      };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <article
      className="news-card"
      onClick={(e) => {
        if (!e.target.closest(".bm-btn")) {
          onCardClick(article);
        }
      }}
      style={{
        overflow: "hidden",
        cursor: "pointer",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        animation: "fadeUp 0.5s ease forwards",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 8px 22px rgba(60,40,10,0.12)";
        e.currentTarget.style.borderColor =
          "rgba(130,95,42,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow =
          "0 2px 8px rgba(60,40,10,0.06)";
        e.currentTarget.style.borderColor =
          "rgba(130,95,42,0.28)";
      }}
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: "190px",
          background: "#e9e1d2",
        }}
      >
        <img
          src={
            article.urlToImage ||
            `https://picsum.photos/seed/${article.id}/400/220`
          }
          alt={article.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s ease",
            display: "block",
          }}
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${Math.random()}/400/220`;
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
        />

        {/* Very subtle image overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.12) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {/* =================================================
            CATEGORY
        ================================================= */}

        {article.category && (
          <span
            className="category-badge"
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "rgba(25,21,16,0.88)",
              color: "#d3ad6b",
              border:
                "1px solid rgba(199,166,106,0.45)",
              padding: "4px 9px",
              borderRadius: "2px",
            }}
          >
            {article.category}
          </span>
        )}

        {/* =================================================
            BOOKMARK
        ================================================= */}

        <button
          className="bm-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "34px",
            height: "34px",

            background: saved
              ? "rgba(167,122,53,0.9)"
              : "rgba(25,21,16,0.72)",

            backdropFilter: "blur(5px)",

            border: saved
              ? "1px solid #a77a35"
              : "1px solid rgba(199,166,106,0.4)",

            borderRadius: "50%",
            cursor: "pointer",

            color: saved ? "#fff8e8" : "#d3ad6b",

            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            transition: "all 0.25s",

            boxShadow: saved
              ? "0 0 12px rgba(167,122,53,0.25)"
              : "none",

            animation: saved
              ? "goldPulse 1s ease"
              : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        style={{
          padding: "18px 18px 16px",
        }}
      >
        {/* Article title */}
        <h3
          className="news-card-title"
          style={{
            marginBottom: "8px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.title?.length > 90
            ? article.title.substring(0, 90) + "…"
            : article.title}
        </h3>

        {/* Source / Date */}
        <p
          className="news-card-meta"
          style={{
            marginBottom: "11px",
          }}
        >
          {article.source?.name}
          &nbsp; · &nbsp;
          {formatDate(article.publishedAt)}
        </p>

        {/* Description */}
        <p
          className="news-card-description"
          style={{
            marginBottom: "15px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.description ||
            "No description available."}
        </p>

        {/* =================================================
            BIAS BAR
        ================================================= */}

        <div
          style={{
            borderTop:
              "1px solid rgba(130,95,42,0.15)",
            paddingTop: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "3px",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "6px",
              background: "#ded5c5",
            }}
          >
            <div
              className="bias-bar-segment-left"
              style={{
                width: `${bias.left}%`,
                transition: "width 0.8s",
              }}
            />

            <div
              className="bias-bar-segment-center"
              style={{
                width: `${bias.center}%`,
                transition: "width 0.8s",
              }}
            />

            <div
              className="bias-bar-segment-right"
              style={{
                width: `${bias.right}%`,
                transition: "width 0.8s",
              }}
            />
          </div>

          <p
            style={{
              fontFamily:
                '"IBM Plex Mono", "Courier New", monospace',
              fontSize: "8px",
              letterSpacing: "0.07em",
              color: "#807668",
            }}
          >
            ◆ {bias.label}
          </p>
        </div>
      </div>
    </article>
  );
}