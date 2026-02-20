import { calculateBiasStats } from "../utils/newsUtils";
import LoadingState from "./LoadingState";

const BADGE_STYLES = {
  hot:      { bg:"linear-gradient(135deg,#d84f3b,#dc2626)", label:"🔥 HOT" },
  trending: { bg:"linear-gradient(135deg,#c8973a,#e8b85a)", label:"⭐ TRENDING" },
  multi:    { bg:"linear-gradient(135deg,#3b7dd8,#2563eb)", label:"📍 MULTI-SOURCE" },
  new:      { bg:"linear-gradient(135deg,#2da87a,#059669)", label:"🆕 NEW" },
};

export default function TrendingPage({ articles, isLoading, error, onBack, onRetry, onOpenDetail, onToggleBookmark, isBookmarked }) {
  return (
    <div style={{ animation:"fadeUp 0.4s ease", minHeight:"80vh" }}>
      {/* Header */}
      <div style={{ marginBottom:"40px" }}>
        <button onClick={onBack} style={{
          display:"inline-flex", alignItems:"center", gap:"8px", padding:"10px 20px", marginBottom:"28px",
          background:"transparent", border:"1px solid rgba(200,151,58,0.3)", borderRadius:"3px",
          color:"#c8973a", fontFamily:"'Courier New',monospace", fontSize:"11px",
          fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
        }}
        onMouseEnter={e=>{ e.currentTarget.style.background="rgba(200,151,58,0.1)"; e.currentTarget.style.transform="translateX(-4px)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.transform=""; }}
        >← Back to Home</button>

        <div style={{ textAlign:"center" }}>
          <p style={{ fontFamily:"'Courier New',monospace", fontSize:"10px", color:"#6b6560", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:"12px" }}>
            Live Coverage Analysis
          </p>
          <h1 style={{ fontFamily:"'UnifrakturMaguntia',cursive", fontSize:"clamp(2.5rem,5vw,4rem)", color:"#faf6ef", marginBottom:"12px" }}>
            🔥 Trending Topics
          </h1>
          <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif", fontStyle:"italic", color:"#6b6560", fontSize:"1rem" }}>
            Major stories being covered across the media spectrum
          </p>
          <hr className="gold-rule" style={{ maxWidth:"400px", margin:"20px auto 0" }} />
        </div>
      </div>

      {isLoading && <LoadingState />}

      {error && !isLoading && (
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <p style={{ fontSize:"3rem", marginBottom:"16px" }}>📰</p>
          <h3 style={{ fontFamily:"'Libre Baskerville',Georgia,serif", color:"#faf6ef", marginBottom:"12px", fontSize:"1.5rem" }}>No Trending Topics Found</h3>
          <p style={{ color:"#6b6560", marginBottom:"24px", fontFamily:"'Courier New',monospace", fontSize:"12px" }}>{error}</p>
          <button onClick={onRetry} style={{ padding:"12px 28px", background:"linear-gradient(135deg,#c8973a,#e8b85a)", border:"none", borderRadius:"3px", color:"#0a0a0a", fontFamily:"'Courier New',monospace", fontSize:"11px", fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer" }}>
            🔄 Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="trending-grid">
          {articles.map((item, idx) => {
            const saved = isBookmarked({ url: item.originalSource.url });
            const biasStats = item.hasBiasAnalysis ? calculateBiasStats(item.sources) : null;
            const badge = BADGE_STYLES[item.type] || BADGE_STYLES.new;

            return (
              <article key={item.id} style={{
                background:"linear-gradient(160deg,#141414,#111)",
                border:"1px solid rgba(200,151,58,0.12)", borderRadius:"6px",
                overflow:"hidden", display:"grid", gridTemplateColumns:"380px 1fr",
                transition:"all 0.35s ease", animation:`fadeUp 0.5s ease ${idx*0.08}s both`,
                boxShadow:"0 4px 24px rgba(0,0,0,0.4)",
              }}
              onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,151,58,0.2)"; e.currentTarget.style.borderColor="rgba(200,151,58,0.25)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor="rgba(200,151,58,0.12)"; }}
              >
                {/* Image */}
                <div style={{ position:"relative", overflow:"hidden", minHeight:"320px" }}>
                  <img src={item.urlToImage||"https://picsum.photos/seed/trend/400/320"} alt={item.title}
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s ease" }}
                    onError={e=>e.target.src="https://picsum.photos/seed/fallback/400/320"}
                    onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
                    onMouseLeave={e=>e.target.style.transform=""}
                  />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,transparent 60%,#141414)" }} />
                  <span style={{
                    position:"absolute", top:"14px", left:"14px",
                    background:badge.bg, color:"white",
                    fontFamily:"'Courier New',monospace", fontSize:"9px",
                    fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase",
                    padding:"5px 12px", borderRadius:"2px",
                    boxShadow:"0 2px 12px rgba(0,0,0,0.3)",
                  }}>{item.badge}</span>
                </div>

                {/* Content */}
                <div style={{ padding:"28px", display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"12px", marginBottom:"12px" }}>
                    <h2 onClick={()=>onOpenDetail({...item,url:item.originalSource.url,publishedAt:item.publishedAt})}
                      style={{ fontFamily:"'Libre Baskerville',Georgia,serif", fontSize:"1.35rem", fontWeight:700, color:"#faf6ef", lineHeight:1.35, cursor:"pointer", flex:1, transition:"color 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.color="#c8973a"}
                      onMouseLeave={e=>e.currentTarget.style.color="#faf6ef"}
                    >{item.title}</h2>
                    <button onClick={()=>onToggleBookmark({url:item.originalSource.url,title:item.title,description:item.description,urlToImage:item.urlToImage,publishedAt:item.publishedAt,source:{name:item.originalSource.name}})}
                      style={{ fontSize:"1.3rem", background:"none", border:"none", cursor:"pointer", color: saved?"#c8973a":"#6b6560", transition:"all 0.2s", flexShrink:0 }}
                      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.2)"}
                      onMouseLeave={e=>e.currentTarget.style.transform=""}
                    >{saved?"★":"☆"}</button>
                  </div>

                  {/* Meta tags */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"16px" }}>
                    {[
                      {t:item.originalSource.name, bg:"rgba(59,125,216,0.15)", c:"#3b7dd8"},
                      {t:item.category, bg:"rgba(200,151,58,0.12)", c:"#c8973a"},
                      {t:`📊 ${item.sourceCount} source${item.sourceCount>1?"s":""}`, bg:"rgba(255,255,255,0.05)", c:"#6b6560"},
                    ].map(({t,bg,c})=>(
                      <span key={t} style={{ padding:"4px 10px", background:bg, border:`1px solid ${c}30`, borderRadius:"2px", color:c, fontFamily:"'Courier New',monospace", fontSize:"9px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" }}>{t}</span>
                    ))}
                  </div>

                  <p style={{ fontSize:"0.9rem", color:"#9a9090", lineHeight:1.7, marginBottom:"20px", flex:1, fontStyle:"italic" }}>
                    {item.description}
                  </p>

                  <a href={item.originalSource.url} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"10px 20px", alignSelf:"flex-start", background:"rgba(200,151,58,0.1)", border:"1px solid rgba(200,151,58,0.35)", borderRadius:"3px", color:"#c8973a", fontFamily:"'Courier New',monospace", fontSize:"10px", fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase", textDecoration:"none", transition:"all 0.2s", marginBottom:"20px" }}
                    onMouseEnter={e=>{ e.currentTarget.style.background="rgba(200,151,58,0.2)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="rgba(200,151,58,0.1)"; e.currentTarget.style.transform=""; }}
                  >📰 Read Original →</a>

                  {/* Bias section */}
                  <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(200,151,58,0.12)", borderRadius:"4px", padding:"16px" }}>
                    <p style={{ fontFamily:"'Courier New',monospace", fontSize:"9px", color:"#c8973a", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"12px", fontWeight:700 }}>📊 Coverage Analysis</p>
                    {item.hasBiasAnalysis && biasStats ? (
                      <>
                        <div style={{ display:"flex", height:"48px", borderRadius:"3px", overflow:"hidden", marginBottom:"10px", boxShadow:"0 2px 12px rgba(0,0,0,0.3)" }}>
                          {[
                            {pct:biasStats.left, bg:"linear-gradient(135deg,#3b7dd8,#2563eb)", l:"LEFT"},
                            {pct:biasStats.center, bg:"linear-gradient(135deg,#2da87a,#059669)", l:"CENTER"},
                            {pct:biasStats.right, bg:"linear-gradient(135deg,#d84f3b,#dc2626)", l:"RIGHT"},
                          ].map(({pct,bg,l})=>(
                            <div key={l} style={{ width:`${pct}%`, background:bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, minWidth:pct>0?"32px":"0", overflow:"hidden", transition:"width 0.8s", fontFamily:"'Courier New',monospace" }}>
                              {pct>10&&<><span style={{ fontSize:"8px", letterSpacing:"0.15em" }}>{l}</span><span style={{ fontSize:"1rem" }}>{pct}%</span></>}
                            </div>
                          ))}
                        </div>
                        <p style={{ fontFamily:"'Courier New',monospace", fontSize:"9px", color:"#6b6560", textAlign:"center", marginBottom:"12px", letterSpacing:"0.05em" }}>
                          {item.sourceCount} sources · {biasStats.counts.left}L / {biasStats.counts.center}C / {biasStats.counts.right}R
                        </p>
                        <button onClick={()=>onOpenDetail({...item,url:item.originalSource.url,publishedAt:item.publishedAt})}
                          style={{ width:"100%", padding:"10px", background:"transparent", border:"1px solid rgba(200,151,58,0.3)", borderRadius:"3px", color:"#c8973a", fontFamily:"'Courier New',monospace", fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}
                          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(200,151,58,0.1)"; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}
                        >View Full Bias Analysis →</button>
                      </>
                    ) : (
                      <p style={{ fontFamily:"'Courier New',monospace", fontSize:"10px", color:"#6b6560", lineHeight:1.6, background:"rgba(200,151,58,0.06)", padding:"10px 12px", borderRadius:"3px", borderLeft:"2px solid rgba(200,151,58,0.3)" }}>
                        🆕 Breaking — bias analysis available once multiple outlets cover this story.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
