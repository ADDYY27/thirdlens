export default function NewsCard({ article, onCardClick, onToggleBookmark, isBookmarked, getBias }) {
  const saved = isBookmarked(article);
  const bias = getBias ? getBias(article) : { left: 0, center: 100, right: 0, label: "Single source" };
  const formatDate = (iso) => { try { return new Date(iso).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}); } catch{ return ""; } };

  return (
    <article
      onClick={e => { if(!e.target.closest(".bm-btn")) onCardClick(article); }}
      style={{
        background:"linear-gradient(160deg,#1a1a1a 0%,#141414 100%)",
        border:"1px solid rgba(200,151,58,0.12)",
        borderRadius:"4px",
        overflow:"hidden",
        cursor:"pointer",
        transition:"all 0.35s cubic-bezier(0.165,0.84,0.44,1)",
        boxShadow:"0 4px 24px rgba(0,0,0,0.4)",
        animation:"fadeUp 0.5s ease forwards",
      }}
      onMouseEnter={e=>{
        e.currentTarget.style.transform="translateY(-6px)";
        e.currentTarget.style.boxShadow="0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,151,58,0.25)";
        e.currentTarget.style.borderColor="rgba(200,151,58,0.3)";
      }}
      onMouseLeave={e=>{
        e.currentTarget.style.transform="";
        e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.4)";
        e.currentTarget.style.borderColor="rgba(200,151,58,0.12)";
      }}
    >
      {/* Image */}
      <div style={{ position:"relative", overflow:"hidden", height:"190px" }}>
        <img
          src={article.urlToImage || `https://picsum.photos/seed/${article.id}/400/220`}
          alt={article.title}
          style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease", display:"block" }}
          onError={e=>{ e.target.src=`https://picsum.photos/seed/${Math.random()}/400/220`; }}
          onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
          onMouseLeave={e=>e.target.style.transform=""}
        />
        {/* Dark overlay gradient */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)" }} />

        {/* Category badge */}
        {article.category && (
          <span style={{
            position:"absolute", top:"12px", left:"12px",
            background:"rgba(10,10,10,0.85)", backdropFilter:"blur(8px)",
            border:"1px solid rgba(200,151,58,0.4)",
            color:"#c8973a", fontSize:"9px", fontWeight:700,
            fontFamily:"'Courier New',monospace",
            letterSpacing:"0.2em", textTransform:"uppercase",
            padding:"4px 10px", borderRadius:"2px",
          }}>{article.category}</span>
        )}

        {/* Bookmark btn */}
        <button className="bm-btn"
          onClick={e=>{ e.stopPropagation(); onToggleBookmark(article); }}
          style={{
            position:"absolute", top:"10px", right:"10px",
            width:"34px", height:"34px",
            background: saved ? "rgba(200,151,58,0.9)" : "rgba(10,10,10,0.75)",
            backdropFilter:"blur(8px)",
            border: saved ? "1px solid #c8973a" : "1px solid rgba(200,151,58,0.3)",
            borderRadius:"50%", cursor:"pointer",
            fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.25s", boxShadow: saved ? "0 0 12px rgba(200,151,58,0.4)" : "none",
            animation: saved ? "goldPulse 1s ease" : "none",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.1)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform=""; }}
        >{saved ? "★" : "☆"}</button>
      </div>

      {/* Content */}
      <div style={{ padding:"18px 18px 16px" }}>
        <h3 style={{
          fontFamily:"'Libre Baskerville',Georgia,serif",
          fontSize:"1.05rem", fontWeight:700, lineHeight:1.4,
          color:"#faf6ef", marginBottom:"8px",
          display:"-webkit-box", WebkitLineClamp:2,
          WebkitBoxOrient:"vertical", overflow:"hidden",
        }}>
          {article.title?.length > 90 ? article.title.substring(0,90)+"…" : article.title}
        </h3>

        <p style={{ fontSize:"11px", color:"#6b6560", fontFamily:"'Courier New',monospace", letterSpacing:"0.05em", marginBottom:"10px" }}>
          {article.source?.name} &nbsp;·&nbsp; {formatDate(article.publishedAt)}
        </p>

        <p style={{
          fontSize:"0.88rem", color:"#9a9090", lineHeight:1.6,
          display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden",
          marginBottom:"14px",
        }}>
          {article.description || "No description available."}
        </p>

        {/* Bias bar */}
        <div style={{ borderTop:"1px solid rgba(200,151,58,0.1)", paddingTop:"12px" }}>
          <div style={{ display:"flex", height:"3px", borderRadius:"2px", overflow:"hidden", marginBottom:"6px", background:"#252525" }}>
            <div style={{ width:`${bias.left}%`, background:"linear-gradient(90deg,#3b7dd8,#2563eb)", transition:"width 0.8s" }} />
            <div style={{ width:`${bias.center}%`, background:"linear-gradient(90deg,#2da87a,#059669)", transition:"width 0.8s" }} />
            <div style={{ width:`${bias.right}%`, background:"linear-gradient(90deg,#d84f3b,#dc2626)", transition:"width 0.8s" }} />
          </div>
          <p style={{ fontSize:"10px", color:"#6b6560", fontFamily:"'Courier New',monospace", letterSpacing:"0.05em" }}>
            ◆ {bias.label}
          </p>
        </div>
      </div>
    </article>
  );
}
