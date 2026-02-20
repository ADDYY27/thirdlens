export default function OpinionCard({ opinion, onOpen, onLike, user }) {
  const liked = user && opinion.likes?.includes(user.uid);
  const fmtDate = (ts) => { try { return ts?.toDate ? ts.toDate().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "Recent"; } catch{ return "Recent"; }};

  return (
    <article onClick={onOpen} style={{
      background:"linear-gradient(160deg,#1a1a1a,#141414)",
      border:"1px solid rgba(200,151,58,0.1)",
      borderRadius:"4px", padding:"28px", cursor:"pointer",
      transition:"all 0.3s ease", boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
      display:"flex", flexDirection:"column", gap:"14px",
    }}
    onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(200,151,58,0.3)"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.5)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(200,151,58,0.1)"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.3)"; }}
    >
      {/* Category + date */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        {opinion.category && (
          <span style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#c8973a",letterSpacing:"0.2em",textTransform:"uppercase",background:"rgba(200,151,58,0.08)",border:"1px solid rgba(200,151,58,0.2)",padding:"3px 9px",borderRadius:"2px" }}>
            {opinion.category}
          </span>
        )}
        <span style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560",letterSpacing:"0.05em" }}>{fmtDate(opinion.createdAt)}</span>
      </div>

      {/* Title */}
      <h3 style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"1.15rem",fontWeight:700,color:"#faf6ef",lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
        {opinion.title}
      </h3>

      {/* Tagline / excerpt */}
      {opinion.tagline && (
        <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontStyle:"italic",fontSize:"0.9rem",color:"#9a9090",lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
          {opinion.tagline}
        </p>
      )}

      {/* Tagged article */}
      {opinion.taggedArticle && (
        <div style={{ background:"rgba(200,151,58,0.05)",border:"1px solid rgba(200,151,58,0.15)",borderLeft:"3px solid rgba(200,151,58,0.5)",borderRadius:"2px",padding:"10px 12px" }}>
          <p style={{ fontFamily:"'Courier New',monospace",fontSize:"8px",color:"#c8973a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"4px" }}>Re: Article</p>
          <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.82rem",color:"#9a9090",lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
            {opinion.taggedArticle.title}
          </p>
        </div>
      )}

      <hr style={{ border:"none",height:"1px",background:"rgba(200,151,58,0.08)" }} />

      {/* Footer */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"30px",height:"30px",borderRadius:"50%",background:"rgba(200,151,58,0.1)",border:"1px solid rgba(200,151,58,0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"#c8973a",fontWeight:700,fontSize:"12px" }}>
            {opinion.authorName?.[0]?.toUpperCase()||"?"}
          </div>
          <span style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.82rem",color:"#9a9090" }}>{opinion.authorName}</span>
        </div>
        <div style={{ display:"flex", gap:"14px" }}>
          <button onClick={e=>{ e.stopPropagation(); onLike(); }} style={{ background:"none",border:"none",cursor:"pointer",color:liked?"#c8973a":"#6b6560",fontFamily:"'Courier New',monospace",fontSize:"11px",display:"flex",alignItems:"center",gap:"4px",transition:"color 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.color="#c8973a"}
            onMouseLeave={e=>e.currentTarget.style.color=liked?"#c8973a":"#6b6560"}
          >{liked?"♥":"♡"} {opinion.likes?.length||0}</button>
          <span style={{ fontFamily:"'Courier New',monospace",fontSize:"10px",color:"#6b6560",display:"flex",alignItems:"center",gap:"4px" }}>💬 {opinion.commentsCount||0}</span>
        </div>
      </div>
    </article>
  );
}
