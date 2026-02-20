import { useState } from "react";
import { useOpinions } from "../hooks/useOpinions";
import { useAuth } from "../context/AuthContext";
import OpinionCard from "../components/OpinionCard";
import WriteOpinionModal from "../components/WriteOpinionModal";
import OpinionDetailModal from "../components/OpinionDetailModal";

const CATEGORIES = ["All", "Politics", "Economy", "Society", "Technology", "Sports", "Culture", "International"];

export default function OpinionPage({ onShowAuth }) {
  const { opinions, loading, publishOpinion, toggleLike } = useOpinions();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showWrite, setShowWrite] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(null);

  const filtered = activeCategory === "All" ? opinions : opinions.filter(o => o.category === activeCategory);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  const S = {
    page: { minHeight:"80vh", animation:"fadeUp 0.4s ease" },
    header: { textAlign:"center", marginBottom:"48px", paddingBottom:"32px", borderBottom:"1px solid rgba(200,151,58,0.15)" },
    catRow: { display:"flex", flexWrap:"wrap", gap:"8px", justifyContent:"center", marginBottom:"40px" },
    cat: (active) => ({
      padding:"6px 16px", background: active?"rgba(200,151,58,0.15)":"transparent",
      border: active?"1px solid rgba(200,151,58,0.5)":"1px solid rgba(200,151,58,0.15)",
      borderRadius:"2px", color: active?"#c8973a":"#6b6560",
      fontFamily:"'Courier New',monospace", fontSize:"10px", fontWeight:700,
      letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
    }),
    writeBtn: {
      padding:"12px 28px", background:"linear-gradient(135deg,#c8973a,#e8b85a)",
      border:"none", borderRadius:"3px", color:"#0a0a0a",
      fontFamily:"'Courier New',monospace", fontSize:"11px", fontWeight:900,
      letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer",
      boxShadow:"0 4px 20px rgba(200,151,58,0.3)", transition:"all 0.2s",
    },
  };

  return (
    <div style={S.page}>
      {/* Page header */}
      <div style={S.header}>
        <p style={{ fontFamily:"'Courier New',monospace",fontSize:"10px",color:"#6b6560",letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:"12px" }}>
          Reader Voices · Independent Perspectives
        </p>
        <h1 style={{ fontFamily:"'UnifrakturMaguntia',cursive",fontSize:"clamp(2.5rem,5vw,4rem)",color:"#faf6ef",marginBottom:"12px" }}>
          Opinion
        </h1>
        <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontStyle:"italic",color:"#6b6560",fontSize:"1.05rem",maxWidth:"520px",margin:"0 auto 28px" }}>
          Beyond news — the perspectives that shape how we think about it.
        </p>
        <button style={S.writeBtn}
          onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(200,151,58,0.45)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 20px rgba(200,151,58,0.3)"; }}
          onClick={() => user ? setShowWrite(true) : onShowAuth()}
        >
          ✍ Write an Opinion
        </button>
      </div>

      {/* Category filters */}
      <div style={S.catRow}>
        {CATEGORIES.map(cat => (
          <button key={cat} style={S.cat(activeCategory===cat)} onClick={()=>setActiveCategory(cat)}
            onMouseEnter={e=>{ if(activeCategory!==cat){ e.currentTarget.style.color="#c8973a"; e.currentTarget.style.borderColor="rgba(200,151,58,0.3)"; }}}
            onMouseLeave={e=>{ if(activeCategory!==cat){ e.currentTarget.style.color="#6b6560"; e.currentTarget.style.borderColor="rgba(200,151,58,0.15)"; }}}
          >{cat}</button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign:"center",padding:"80px",color:"#6b6560" }}>
          <div style={{ width:"36px",height:"36px",border:"3px solid rgba(200,151,58,0.15)",borderTop:"3px solid #c8973a",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px" }} />
          <p style={{ fontFamily:"'Courier New',monospace",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase" }}>Loading opinions…</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign:"center",padding:"80px 20px" }}>
          <p style={{ fontSize:"3rem",marginBottom:"16px" }}>✍</p>
          <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",color:"#9a9090",fontSize:"1.1rem",marginBottom:"8px" }}>No opinions yet in this category.</p>
          <p style={{ fontFamily:"'Courier New',monospace",fontSize:"11px",color:"#6b6560",letterSpacing:"0.1em" }}>Be the first to share your perspective.</p>
        </div>
      )}

      {!loading && featured && (
        <>
          {/* FEATURED — large hero card */}
          <FeaturedOpinion opinion={featured} onOpen={()=>setSelectedOpinion(featured)} onLike={()=>user ? toggleLike(featured.id,user.uid) : onShowAuth()} user={user} />

          {/* DIVIDER */}
          {rest.length > 0 && (
            <div style={{ display:"flex",alignItems:"center",gap:"16px",margin:"40px 0 32px" }}>
              <hr style={{ flex:1,border:"none",height:"1px",background:"rgba(200,151,58,0.15)" }} />
              <span style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560",letterSpacing:"0.25em",textTransform:"uppercase" }}>More Opinions</span>
              <hr style={{ flex:1,border:"none",height:"1px",background:"rgba(200,151,58,0.15)" }} />
            </div>
          )}

          {/* GRID */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:"24px" }}>
            {rest.map((op, i) => (
              <div key={op.id} style={{ animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>
                <OpinionCard opinion={op} onOpen={()=>setSelectedOpinion(op)} onLike={()=>user ? toggleLike(op.id,user.uid) : onShowAuth()} user={user} />
              </div>
            ))}
          </div>
        </>
      )}

      {showWrite && <WriteOpinionModal onClose={()=>setShowWrite(false)} onPublish={publishOpinion} />}
      {selectedOpinion && <OpinionDetailModal opinion={selectedOpinion} onClose={()=>setSelectedOpinion(null)} onLike={()=>user ? toggleLike(selectedOpinion.id,user.uid) : onShowAuth()} user={user} onShowAuth={onShowAuth} />}
    </div>
  );
}

// ── Featured hero opinion ─────────────────────────────────────────────────────
function FeaturedOpinion({ opinion, onOpen, onLike, user }) {
  const liked = user && opinion.likes?.includes(user.uid);
  const fmtDate = (ts) => { try { return ts?.toDate ? ts.toDate().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "Recent"; } catch{ return "Recent"; }};

  return (
    <div onClick={onOpen} style={{
      background:"linear-gradient(160deg,#161410,#111)",
      border:"1px solid rgba(200,151,58,0.2)",
      borderRadius:"6px", overflow:"hidden", cursor:"pointer",
      display:"grid", gridTemplateColumns:"1fr 1fr",
      marginBottom:"16px", transition:"all 0.35s ease",
      boxShadow:"0 4px 24px rgba(0,0,0,0.4)",
    }}
    onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 16px 48px rgba(0,0,0,0.6),0 0 0 1px rgba(200,151,58,0.25)"; e.currentTarget.style.borderColor="rgba(200,151,58,0.3)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor="rgba(200,151,58,0.2)"; }}
    >
      {/* Left — text */}
      <div style={{ padding:"44px 48px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
            <span style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#c8973a",letterSpacing:"0.25em",textTransform:"uppercase",background:"rgba(200,151,58,0.1)",border:"1px solid rgba(200,151,58,0.3)",padding:"4px 10px",borderRadius:"2px" }}>
              ◆ Featured
            </span>
            {opinion.category && <span style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560",letterSpacing:"0.15em",textTransform:"uppercase" }}>{opinion.category}</span>}
          </div>
          <h2 style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"1.9rem",fontWeight:700,color:"#faf6ef",lineHeight:1.3,marginBottom:"16px" }}>
            {opinion.title}
          </h2>
          {opinion.tagline && <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontStyle:"italic",fontSize:"1.05rem",color:"#9a9090",lineHeight:1.65,marginBottom:"20px" }}>{opinion.tagline}</p>}
        </div>
        <div>
          <hr style={{ border:"none",height:"1px",background:"rgba(200,151,58,0.15)",marginBottom:"16px" }} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{ width:"36px",height:"36px",borderRadius:"50%",background:"rgba(200,151,58,0.15)",border:"1px solid rgba(200,151,58,0.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"#c8973a",fontWeight:700,fontSize:"14px" }}>
                {opinion.authorName?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.9rem",color:"#faf6ef",fontWeight:600 }}>{opinion.authorName}</p>
                <p style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560",letterSpacing:"0.08em" }}>{fmtDate(opinion.createdAt)}</p>
              </div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:"16px" }}>
              <button onClick={e=>{ e.stopPropagation(); onLike(); }} style={{ background:"transparent",border:"none",cursor:"pointer",color: liked?"#c8973a":"#6b6560",fontSize:"0.9rem",display:"flex",alignItems:"center",gap:"5px",fontFamily:"'Courier New',monospace",fontSize:"11px",transition:"all 0.2s" }}>
                {liked?"♥":"♡"} {opinion.likes?.length||0}
              </button>
              <span style={{ fontFamily:"'Courier New',monospace",fontSize:"10px",color:"#6b6560" }}>💬 {opinion.commentsCount||0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — visual */}
      <div style={{ background:"linear-gradient(135deg,#1a1410,#0f0d0a)", display:"flex", alignItems:"center", justifyContent:"center", padding:"48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,opacity:0.05,backgroundImage:"repeating-linear-gradient(45deg,rgba(200,151,58,1) 0px,rgba(200,151,58,1) 1px,transparent 1px,transparent 20px)" }} />
        <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"5rem",color:"rgba(200,151,58,0.12)",position:"absolute",top:"20px",left:"20px",lineHeight:1 }}>"</p>
        <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"1.15rem",fontStyle:"italic",color:"#9a9090",textAlign:"center",lineHeight:1.8,position:"relative",zIndex:1 }}>
          {opinion.body?.substring(0,220)}{opinion.body?.length>220?"…":""}
        </p>
        <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"5rem",color:"rgba(200,151,58,0.12)",position:"absolute",bottom:"10px",right:"20px",lineHeight:1 }}>"</p>
      </div>
    </div>
  );
}
