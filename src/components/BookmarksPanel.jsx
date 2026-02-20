import NewsCard from "./NewsCard";

export default function BookmarksPanel({ bookmarks, onClose, onOpenDetail, onToggleBookmark, isBookmarked, getBias }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"60px 24px 24px", animation:"fadeUp 0.3s ease" }}>
      <div style={{ background:"linear-gradient(160deg,#141414,#111)", border:"1px solid rgba(200,151,58,0.25)", borderRadius:"6px", width:"100%", maxWidth:"1100px", maxHeight:"85vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,151,58,0.1)" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"24px 28px", borderBottom:"1px solid rgba(200,151,58,0.15)" }}>
          <div>
            <h2 style={{ fontFamily:"'UnifrakturMaguntia',cursive", fontSize:"1.8rem", color:"#faf6ef", marginBottom:"4px" }}>📌 My Bookmarks</h2>
            <p style={{ fontFamily:"'Courier New',monospace", fontSize:"10px", color:"#6b6560", letterSpacing:"0.15em", textTransform:"uppercase" }}>
              {bookmarks.length} article{bookmarks.length!==1?"s":""} saved
            </p>
          </div>
          <button onClick={onClose} style={{
            width:"36px", height:"36px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
            background:"rgba(216,79,59,0.15)", border:"1px solid rgba(216,79,59,0.4)",
            color:"#d84f3b", fontSize:"16px", fontWeight:700, cursor:"pointer", transition:"all 0.25s",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(216,79,59,0.3)"; e.currentTarget.style.transform="rotate(90deg)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(216,79,59,0.15)"; e.currentTarget.style.transform=""; }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ overflowY:"auto", padding:"24px 28px" }}>
          {bookmarks.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 20px", color:"#6b6560" }}>
              <p style={{ fontSize:"4rem", marginBottom:"16px" }}>📑</p>
              <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif", fontSize:"1.1rem", color:"#9a9090", marginBottom:"8px" }}>No bookmarks yet.</p>
              <p style={{ fontFamily:"'Courier New',monospace", fontSize:"11px", letterSpacing:"0.1em" }}>Click ☆ on any article to save it here.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"16px" }}>
              {bookmarks.map((article, i) => (
                <div key={article.url||i} style={{ animation:`fadeUp 0.3s ease ${i*0.05}s both` }}>
                  <NewsCard article={article} onCardClick={onOpenDetail} onToggleBookmark={onToggleBookmark} isBookmarked={isBookmarked} getBias={getBias} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
