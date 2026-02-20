import NewsCard from "./NewsCard";

const SOURCE_BIAS_LABELS = {
  "the-hindu": { lean: "Center-Left", dot: "#3b7dd8" },
  "indian-express": { lean: "Center", dot: "#2da87a" },
  "times-of-india": { lean: "Center-Right", dot: "#d84f3b" },
};

export default function NewsColumns({ sources, articles, onCardClick, onToggleBookmark, isBookmarked, getBias }) {
  return (
    <div className="news-col-grid">
      {sources.map(({ id, label }, colIdx) => {
        const list = articles[id] || [];
        const meta = SOURCE_BIAS_LABELS[id] || { lean: "Center", dot: "#2da87a" };

        return (
          <section key={id} style={{ animation:`fadeUp 0.5s ease ${colIdx*0.1}s both` }}>
            {/* Column header */}
            <div style={{ marginBottom:"20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:meta.dot, display:"block", boxShadow:`0 0 8px ${meta.dot}` }} />
                <h2 style={{
                  fontFamily:"'UnifrakturMaguntia',cursive",
                  fontSize:"1.7rem", fontWeight:400, color:"#faf6ef", letterSpacing:"1px",
                }}>
                  {label}
                </h2>
              </div>
              <p style={{ fontFamily:"'Courier New',monospace", fontSize:"9px", color:"#6b6560", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>
                {meta.lean} · Indian News Source
              </p>
              <hr className="gold-rule" />
            </div>

            {/* Trending highlights box */}
            {list.length > 0 && (
              <div style={{
                background:"linear-gradient(135deg,#141208 0%,#1a1510 100%)",
                border:"1px solid rgba(200,151,58,0.2)",
                borderLeft:"3px solid #c8973a",
                borderRadius:"4px", padding:"16px", marginBottom:"20px",
              }}>
                <p style={{ fontFamily:"'Courier New',monospace", fontSize:"9px", color:"#c8973a", letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:"12px", fontWeight:700 }}>
                  🔥 Breaking Today
                </p>
                <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:"10px" }}>
                  {list.slice(0,3).map((a) => (
                    <li key={a.id} onClick={()=>onCardClick(a)} style={{
                      fontSize:"0.82rem", color:"#9a9090", lineHeight:1.4, cursor:"pointer",
                      paddingLeft:"14px", position:"relative", transition:"color 0.2s",
                      fontFamily:"'Libre Baskerville',Georgia,serif",
                    }}
                    onMouseEnter={e=>e.currentTarget.style.color="#c8973a"}
                    onMouseLeave={e=>e.currentTarget.style.color="#9a9090"}
                    >
                      <span style={{ position:"absolute", left:0, color:"rgba(200,151,58,0.5)", fontWeight:700 }}>›</span>
                      {a.title?.length>70 ? a.title.substring(0,70)+"…" : a.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cards */}
            {list.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"#6b6560" }}>
                <p style={{ fontSize:"2.5rem", marginBottom:"12px" }}>📰</p>
                <p style={{ fontFamily:"'Courier New',monospace", fontSize:"12px", letterSpacing:"0.1em" }}>No articles in this category</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                {list.map((article, i) => (
                  <div key={article.id} style={{ animation:`fadeUp 0.4s ease ${i*0.07}s both` }}>
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
