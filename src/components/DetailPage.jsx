import { useMemo } from "react";
import { calculateBiasStats, detectSourceFromURL, findSimilarArticles, getBiasInsight, formatBiasLabel } from "../utils/newsUtils";

const BIAS_ORDER = { left:1,"center-left":2,center:3,"center-right":4,right:5 };
const BIAS_COLORS = { left:"#3b7dd8", center:"#2da87a", right:"#d84f3b" };

export default function DetailPage({ article, allArticles, onBack }) {
  const { coveringSources, biasStats } = useMemo(()=>{
    const similar = findSimilarArticles(article, allArticles);
    const sources = [];
    const curr = detectSourceFromURL(article.url);
    if(curr) sources.push(curr);
    similar.forEach(a=>{ const s=detectSourceFromURL(a.url); if(s&&!sources.find(x=>x.name===s.name)) sources.push(s); });
    if(sources.length===0) sources.push(
      {name:"The Hindu",bias:"center-left",credibility:"high"},
      {name:"Indian Express",bias:"center",credibility:"high"},
      {name:"Times of India",bias:"center-right",credibility:"high"}
    );
    sources.sort((a,b)=>(BIAS_ORDER[a.bias]||3)-(BIAS_ORDER[b.bias]||3));
    return { coveringSources:sources, biasStats:calculateBiasStats(sources) };
  },[article,allArticles]);

  const insight = getBiasInsight(biasStats, coveringSources.length);
  const biasClass = (b) => b?.includes("left")?"left":b?.includes("right")?"right":"center";

  return (
    <div style={{ animation:"fadeUp 0.4s ease", minHeight:"80vh" }}>
      {/* Back button */}
      <button onClick={onBack} style={{
        display:"inline-flex", alignItems:"center", gap:"8px",
        padding:"10px 20px", marginBottom:"32px",
        background:"transparent", border:"1px solid rgba(200,151,58,0.3)",
        borderRadius:"3px", color:"#c8973a",
        fontFamily:"'Courier New',monospace", fontSize:"11px",
        fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase",
        cursor:"pointer", transition:"all 0.2s",
      }}
      onMouseEnter={e=>{ e.currentTarget.style.background="rgba(200,151,58,0.1)"; e.currentTarget.style.transform="translateX(-4px)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.transform=""; }}
      >← Back to News</button>

      {/* Hero */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:"40px",
        marginBottom:"48px", background:"linear-gradient(160deg,#141414,#111)",
        border:"1px solid rgba(200,151,58,0.15)", borderRadius:"6px", overflow:"hidden",
      }}>
        <div style={{ position:"relative", minHeight:"360px" }}>
          <img src={article.urlToImage||`https://picsum.photos/seed/detail/600/400`} alt={article.title}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            onError={e=>e.target.src="https://picsum.photos/seed/fallback/600/400"}
          />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,transparent 60%,#141414)" }} />
        </div>
        <div style={{ padding:"36px 36px 36px 0", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          {article.category && (
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:"9px", color:"#c8973a", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:"16px" }}>
              ◆ {article.category}
            </span>
          )}
          <h1 style={{ fontFamily:"'Libre Baskerville',Georgia,serif", fontSize:"1.75rem", fontWeight:700, color:"#faf6ef", lineHeight:1.35, marginBottom:"16px" }}>
            {article.title}
          </h1>
          <p style={{ fontFamily:"'Courier New',monospace", fontSize:"11px", color:"#6b6560", marginBottom:"20px", letterSpacing:"0.05em" }}>
            {article.source?.name} &nbsp;·&nbsp; {new Date(article.publishedAt).toDateString()}
          </p>
          <hr className="gold-rule" style={{ marginBottom:"20px" }} />
          <p style={{ fontSize:"1rem", color:"#9a9090", lineHeight:1.75, marginBottom:"24px", fontStyle:"italic" }}>
            {article.description || "No detailed description available."}
          </p>
          <a href={article.url} target="_blank" rel="noopener noreferrer"
            style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"12px 24px", alignSelf:"flex-start",
              background:"linear-gradient(135deg,#c8973a,#e8b85a)",
              borderRadius:"3px", color:"#0a0a0a",
              fontFamily:"'Courier New',monospace", fontSize:"11px",
              fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase",
              textDecoration:"none", transition:"all 0.2s",
              boxShadow:"0 4px 20px rgba(200,151,58,0.3)",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(200,151,58,0.5)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 20px rgba(200,151,58,0.3)"; }}
          >Read Full Article →</a>
        </div>
      </div>

      {/* Bias Analysis Panel */}
      <div style={{ background:"linear-gradient(160deg,#141208,#111)", border:"1px solid rgba(200,151,58,0.2)", borderRadius:"6px", padding:"40px", marginBottom:"32px" }}>
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <h2 style={{ fontFamily:"'UnifrakturMaguntia',cursive", fontSize:"2.2rem", color:"#faf6ef", marginBottom:"8px" }}>📊 Media Bias Analysis</h2>
          <p style={{ fontFamily:"'Courier New',monospace", fontSize:"11px", color:"#6b6560", letterSpacing:"0.15em", textTransform:"uppercase" }}>
            How different political perspectives are covering this story
          </p>
        </div>
        <hr className="gold-rule" style={{ marginBottom:"32px" }} />

        {/* Big bias bar */}
        <div style={{ display:"flex", height:"100px", borderRadius:"4px", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.5)", marginBottom:"12px" }}>
          {[
            {label:"LEFT",pct:biasStats.left,bg:"linear-gradient(135deg,#3b7dd8,#2563eb)"},
            {label:"CENTER",pct:biasStats.center,bg:"linear-gradient(135deg,#2da87a,#059669)"},
            {label:"RIGHT",pct:biasStats.right,bg:"linear-gradient(135deg,#d84f3b,#dc2626)"},
          ].map(({label,pct,bg})=>(
            <div key={label} style={{ width:`${pct}%`, background:bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, transition:"all 0.8s cubic-bezier(0.4,0,0.2,1)", minWidth:pct>0?"60px":"0", overflow:"hidden" }}>
              {pct>10&&<><span style={{ fontSize:"10px", letterSpacing:"0.2em", marginBottom:"6px", fontFamily:"'Courier New',monospace" }}>{label}</span><span style={{ fontSize:"2rem" }}>{pct}%</span></>}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"32px" }}>
          {[{l:"Left",p:biasStats.left,c:"#3b7dd8"},{l:"Center",p:biasStats.center,c:"#2da87a"},{l:"Right",p:biasStats.right,c:"#d84f3b"}].map(({l,p,c})=>(
            <span key={l} style={{ fontFamily:"'Courier New',monospace", fontSize:"10px", color:c, letterSpacing:"0.1em" }}>{l} {p}%</span>
          ))}
        </div>

        {/* Sources */}
        <h3 style={{ fontFamily:"'Libre Baskerville',Georgia,serif", fontSize:"1.2rem", color:"#faf6ef", marginBottom:"16px" }}>📰 Sources Covering This Story</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"12px", marginBottom:"28px" }}>
          {coveringSources.map((s,i)=>{
            const bc = biasClass(s.bias);
            return (
              <div key={i} style={{
                background:"rgba(255,255,255,0.03)", borderRadius:"4px",
                borderLeft:`3px solid ${BIAS_COLORS[bc]||"#2da87a"}`,
                padding:"14px 16px", transition:"all 0.2s",
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(200,151,58,0.05)"; e.currentTarget.style.transform="translateX(4px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.transform=""; }}
              >
                <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif", fontWeight:700, color:"#faf6ef", marginBottom:"4px" }}>{s.name}</p>
                <p style={{ fontFamily:"'Courier New',monospace", fontSize:"10px", color:"#6b6560", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                  {formatBiasLabel(s.bias)} · {s.credibility} credibility
                </p>
              </div>
            );
          })}
        </div>

        {/* Insight */}
        <div style={{ background:"rgba(200,151,58,0.06)", border:"1px solid rgba(200,151,58,0.2)", borderRadius:"4px", padding:"20px" }}>
          <p style={{ fontFamily:"'Courier New',monospace", fontSize:"10px", color:"#c8973a", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px", fontWeight:700 }}>◆ Analysis Insight</p>
          <p style={{ color:"#9a9090", lineHeight:1.7, fontSize:"0.95rem" }}>{insight}</p>
          <p style={{ fontFamily:"'Courier New',monospace", fontSize:"10px", color:"#6b6560", marginTop:"12px" }}>
            Based on {coveringSources.length} source{coveringSources.length!==1?"s":""} covering this story.
          </p>
        </div>
      </div>
    </div>
  );
}
