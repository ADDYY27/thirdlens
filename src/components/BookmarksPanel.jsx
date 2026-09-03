import NewsCard from "./NewsCard";

export default function BookmarksPanel({
  bookmarks,
  onClose,
  onOpenDetail,
  onToggleBookmark,
  isBookmarked,
  getBias,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookmarks-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(10,10,10,0.72)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "60px 24px 24px",
        animation: "fadeUp 0.3s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          background: "#f4efe4",
          border: "1px solid rgba(130,95,42,0.32)",
          borderRadius: "4px",
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.45)",
          overflow: "hidden",
          color: "#171512",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 28px",
            borderBottom:
              "1px solid rgba(130,95,42,0.2)",
            background: "#faf7ef",
          }}
        >
          <div>
            <h2
              id="bookmarks-title"
              style={{
                margin: "0 0 4px",
                fontFamily:
                  '"Playfair Display", Georgia, serif',
                fontSize: "28px",
                fontWeight: 600,
                color: "#171512",
              }}
            >
              📌 My Bookmarks
            </h2>

            <p
              style={{
                margin: 0,
                fontFamily:
                  '"IBM Plex Mono", monospace',
                fontSize: "8px",
                color: "#8a7f6e",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {bookmarks.length} article
              {bookmarks.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close bookmarks"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border:
                "1px solid rgba(130,95,42,0.3)",
              color: "#8f672d",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            overflowY: "auto",
            padding: "24px 28px",
          }}
        >
          {bookmarks.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
              }}
            >
              <p
                style={{
                  fontSize: "4rem",
                  margin: "0 0 16px",
                }}
              >
                📑
              </p>

              <p
                style={{
                  margin: "0 0 8px",
                  fontFamily:
                    '"Cormorant Garamond", Georgia, serif',
                  fontSize: "20px",
                  color: "#302b25",
                }}
              >
                No bookmarks yet.
              </p>

              <p
                style={{
                  margin: 0,
                  fontFamily:
                    '"IBM Plex Mono", monospace',
                  fontSize: "9px",
                  color: "#8a7f6e",
                  letterSpacing: "0.1em",
                }}
              >
                Click ☆ on any article to save it here.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(320px,1fr))",
                gap: "16px",
              }}
            >
              {bookmarks.map((article, index) => (
                <div
                  key={article.url || index}
                  style={{
                    animation:
                      `fadeUp 0.3s ease ${index * 0.05}s both`,
                  }}
                >
                  <NewsCard
                    article={article}
                    onCardClick={onOpenDetail}
                    onToggleBookmark={onToggleBookmark}
                    isBookmarked={isBookmarked}
                    getBias={getBias}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}