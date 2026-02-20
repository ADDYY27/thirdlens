const NAV_CATEGORIES = ["general", "technology", "sports", "business"];

export default function Navbar({
  activeCategory, onCategoryClick, onShowTrending, onShowBookmarks,
  bookmarkCount, searchInput, onSearchInputChange, onSearch,
}) {
  return (
    <nav style={{
      background: "linear-gradient(180deg,#111111 0%,#0d0d0d 100%)",
      borderBottom: "1px solid rgba(200,151,58,0.25)",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 4px 32px rgba(0,0,0,0.6)",
    }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"0 24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", padding:"14px 0" }}>

          {/* Nav links */}
          <div style={{ display:"flex", alignItems:"center", gap:"4px", flexWrap:"wrap" }}>
            {NAV_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => onCategoryClick(cat)}
                style={{
                  padding: "7px 16px",
                  background: activeCategory === cat ? "rgba(200,151,58,0.15)" : "transparent",
                  border: activeCategory === cat ? "1px solid rgba(200,151,58,0.5)" : "1px solid transparent",
                  borderRadius: "3px",
                  color: activeCategory === cat ? "#c8973a" : "#9a9090",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { if(activeCategory!==cat){ e.target.style.color="#c8973a"; e.target.style.borderColor="rgba(200,151,58,0.3)"; }}}
                onMouseLeave={e => { if(activeCategory!==cat){ e.target.style.color="#9a9090"; e.target.style.borderColor="transparent"; }}}
              >{cat}</button>
            ))}

            {/* Separator */}
            <div style={{ width:"1px", height:"24px", background:"rgba(200,151,58,0.2)", margin:"0 8px" }} />

            {/* Trending */}
            <button onClick={onShowTrending}
              style={{
                padding:"7px 16px", background:"transparent",
                border:"1px solid transparent", borderRadius:"3px",
                color:"#e8b85a", fontFamily:"'Courier New',monospace",
                fontSize:"11px", fontWeight:700, letterSpacing:"0.15em",
                textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
                display:"flex", alignItems:"center", gap:"6px",
              }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(232,184,90,0.1)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <span>🔥</span> Trending
            </button>

            {/* Bookmarks */}
            <button onClick={onShowBookmarks}
              style={{
                padding:"7px 16px",
                background: bookmarkCount > 0 ? "rgba(200,151,58,0.1)" : "transparent",
                border: bookmarkCount > 0 ? "1px solid rgba(200,151,58,0.4)" : "1px solid transparent",
                borderRadius:"3px", color:"#c8973a",
                fontFamily:"'Courier New',monospace", fontSize:"11px",
                fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase",
                cursor:"pointer", transition:"all 0.2s",
                display:"flex", alignItems:"center", gap:"8px",
              }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(200,151,58,0.15)"}
              onMouseLeave={e=>e.currentTarget.style.background=bookmarkCount>0?"rgba(200,151,58,0.1)":"transparent"}
            >
              📌 Bookmarks
              <span style={{
                background:"#c8973a", color:"#0a0a0a",
                fontSize:"10px", fontWeight:900,
                padding:"1px 7px", borderRadius:"10px", minWidth:"20px", textAlign:"center",
              }}>{bookmarkCount}</span>
            </button>
          </div>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <input
              type="text" value={searchInput}
              onChange={e => onSearchInputChange(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearch()}
              placeholder="Search articles…"
              style={{
                width:"220px", padding:"8px 16px",
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(200,151,58,0.25)",
                borderRadius:"3px", color:"#faf6ef",
                fontFamily:"'Courier New',monospace", fontSize:"12px",
                outline:"none", transition:"all 0.2s",
              }}
              onFocus={e=>{ e.target.style.border="1px solid rgba(200,151,58,0.6)"; e.target.style.background="rgba(200,151,58,0.05)"; }}
              onBlur={e=>{ e.target.style.border="1px solid rgba(200,151,58,0.25)"; e.target.style.background="rgba(255,255,255,0.05)"; }}
            />
            <button onClick={onSearch}
              style={{
                padding:"8px 20px",
                background:"linear-gradient(135deg,#c8973a,#e8b85a)",
                border:"none", borderRadius:"3px",
                color:"#0a0a0a", fontFamily:"'Courier New',monospace",
                fontSize:"11px", fontWeight:900, letterSpacing:"0.1em",
                textTransform:"uppercase", cursor:"pointer",
                transition:"all 0.2s", boxShadow:"0 2px 12px rgba(200,151,58,0.3)",
              }}
              onMouseEnter={e=>{ e.target.style.transform="translateY(-1px)"; e.target.style.boxShadow="0 4px 20px rgba(200,151,58,0.5)"; }}
              onMouseLeave={e=>{ e.target.style.transform=""; e.target.style.boxShadow="0 2px 12px rgba(200,151,58,0.3)"; }}
            >Search</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
