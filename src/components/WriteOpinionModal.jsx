import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Politics","Economy","Society","Technology","Sports","Culture","International"];

export default function WriteOpinionModal({ onClose, onPublish, preTaggedArticle }) {
  const { user, userProfile } = useAuth();
  const [form, setForm] = useState({ title:"", tagline:"", body:"", category:"", taggedArticle: preTaggedArticle||null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1=meta, 2=body

  const S = {
    overlay: { position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 24px",overflowY:"auto",animation:"fadeUp 0.3s ease" },
    box: { background:"linear-gradient(160deg,#161410,#111)",border:"1px solid rgba(200,151,58,0.25)",borderRadius:"6px",width:"100%",maxWidth:"720px",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.8)" },
    topBar: { display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 28px",borderBottom:"1px solid rgba(200,151,58,0.12)" },
    input: { width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(200,151,58,0.15)",borderRadius:"3px",color:"#faf6ef",outline:"none",transition:"all 0.2s",boxSizing:"border-box" },
    label: { display:"block",fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"8px",marginTop:"20px" },
    btn: (primary) => ({
      padding:"12px 28px",background: primary?"linear-gradient(135deg,#c8973a,#e8b85a)":"transparent",
      border: primary?"none":"1px solid rgba(200,151,58,0.3)",
      borderRadius:"3px",color: primary?"#0a0a0a":"#c8973a",
      fontFamily:"'Courier New',monospace",fontSize:"11px",fontWeight:900,
      letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s",
    }),
  };

  const onFocus = e => { e.target.style.border="1px solid rgba(200,151,58,0.5)"; e.target.style.background="rgba(200,151,58,0.03)"; };
  const onBlur  = e => { e.target.style.border="1px solid rgba(200,151,58,0.15)"; e.target.style.background="rgba(255,255,255,0.03)"; };

  async function handlePublish() {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.body.trim() || form.body.trim().length < 80) { setError("Opinion must be at least 80 characters."); return; }
    setLoading(true); setError("");
    try {
      await onPublish({
        title: form.title.trim(),
        tagline: form.tagline.trim(),
        body: form.body.trim(),
        category: form.category || "General",
        taggedArticle: form.taggedArticle || null,
        authorName: userProfile?.displayName || user.displayName || "Anonymous",
        authorUid: user.uid,
        authorEmail: user.email,
      });
      onClose();
    } catch(e) { setError("Failed to publish. Please try again."); }
    setLoading(false);
  }

  const wordCount = form.body.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={S.box}>
        {/* Top bar */}
        <div style={S.topBar}>
          <div>
            <h3 style={{ fontFamily:"'UnifrakturMaguntia',cursive",fontSize:"1.5rem",color:"#faf6ef",marginBottom:"2px" }}>Write Opinion</h3>
            <p style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560",letterSpacing:"0.15em",textTransform:"uppercase" }}>
              Writing as {userProfile?.displayName||user?.displayName||"you"}
            </p>
          </div>
          <div style={{ display:"flex",gap:"8px",alignItems:"center" }}>
            {/* Step indicators */}
            {[1,2].map(s=>(
              <div key={s} style={{ width:"28px",height:"28px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background: s===step?"rgba(200,151,58,0.2)":"transparent",border: s===step?"1px solid #c8973a":"1px solid rgba(200,151,58,0.2)",color: s===step?"#c8973a":"#6b6560",fontFamily:"'Courier New',monospace",fontSize:"11px",fontWeight:700 }}>
                {s}
              </div>
            ))}
            <button onClick={onClose} style={{ marginLeft:"8px",width:"32px",height:"32px",background:"transparent",border:"1px solid rgba(200,151,58,0.2)",borderRadius:"50%",color:"#6b6560",cursor:"pointer",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(216,79,59,0.5)"; e.currentTarget.style.color="#d84f3b"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(200,151,58,0.2)"; e.currentTarget.style.color="#6b6560"; }}
            >✕</button>
          </div>
        </div>

        <div style={{ padding:"28px" }}>
          {step === 1 && (
            <>
              <label style={S.label}>Opinion Title *</label>
              <input style={{ ...S.input,fontSize:"1.1rem",fontFamily:"'Libre Baskerville',Georgia,serif" }} placeholder="Your headline — make it count" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} onFocus={onFocus} onBlur={onBlur} />

              <label style={S.label}>One-line Summary (optional)</label>
              <input style={{ ...S.input,fontStyle:"italic",fontFamily:"'Libre Baskerville',Georgia,serif" }} placeholder="A compelling subtitle that draws readers in…" value={form.tagline} onChange={e=>setForm(f=>({...f,tagline:e.target.value}))} onFocus={onFocus} onBlur={onBlur} />

              <label style={S.label}>Category</label>
              <div style={{ display:"flex",flexWrap:"wrap",gap:"8px",marginTop:"4px" }}>
                {CATEGORIES.map(cat=>(
                  <button key={cat} onClick={()=>setForm(f=>({...f,category:cat}))}
                    style={{ padding:"6px 14px",background: form.category===cat?"rgba(200,151,58,0.15)":"transparent",border: form.category===cat?"1px solid rgba(200,151,58,0.5)":"1px solid rgba(200,151,58,0.15)",borderRadius:"2px",color: form.category===cat?"#c8973a":"#6b6560",fontFamily:"'Courier New',monospace",fontSize:"9px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s" }}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Tagged article preview */}
              {form.taggedArticle && (
                <div style={{ marginTop:"20px",background:"rgba(200,151,58,0.05)",border:"1px solid rgba(200,151,58,0.2)",borderLeft:"3px solid #c8973a",borderRadius:"3px",padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                  <div>
                    <p style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#c8973a",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"6px" }}>📎 Tagged Article</p>
                    <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.9rem",color:"#faf6ef",lineHeight:1.4 }}>{form.taggedArticle.title}</p>
                  </div>
                  <button onClick={()=>setForm(f=>({...f,taggedArticle:null}))} style={{ background:"none",border:"none",color:"#6b6560",cursor:"pointer",fontSize:"12px",marginLeft:"12px",flexShrink:0 }}>✕</button>
                </div>
              )}

              <div style={{ display:"flex",justifyContent:"flex-end",marginTop:"28px" }}>
                <button style={S.btn(true)} onClick={()=>{ if(!form.title.trim()){ setError("Add a title first."); return; } setError(""); setStep(2); }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(200,151,58,0.4)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; }}
                >Next: Write Body →</button>
              </div>
              {error && <p style={{ fontFamily:"'Courier New',monospace",fontSize:"11px",color:"#d84f3b",marginTop:"10px" }}>⚠ {error}</p>}
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ marginBottom:"16px",padding:"12px 16px",background:"rgba(200,151,58,0.05)",border:"1px solid rgba(200,151,58,0.15)",borderRadius:"3px" }}>
                <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontWeight:700,color:"#faf6ef",marginBottom:"2px" }}>{form.title}</p>
                {form.tagline && <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontStyle:"italic",color:"#9a9090",fontSize:"0.85rem" }}>{form.tagline}</p>}
              </div>

              <label style={S.label}>Your Opinion * (min. 80 words)</label>
              <textarea
                style={{ ...S.input,minHeight:"320px",resize:"vertical",lineHeight:1.75,fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"1rem" }}
                placeholder="Share your perspective. What do you think, why do you think it, and what should readers consider? Write clearly and honestly."
                value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))}
                onFocus={onFocus} onBlur={onBlur}
              />
              <p style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color: wordCount>=80?"#2da87a":"#6b6560",textAlign:"right",marginTop:"6px",letterSpacing:"0.08em" }}>
                {wordCount} words {wordCount>=80?"✓":"(min. 80)"}
              </p>

              {error && <p style={{ fontFamily:"'Courier New',monospace",fontSize:"11px",color:"#d84f3b",marginTop:"8px" }}>⚠ {error}</p>}

              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"24px" }}>
                <button style={S.btn(false)} onClick={()=>{ setStep(1); setError(""); }}>← Back</button>
                <button style={{ ...S.btn(true), opacity: loading?0.6:1 }} disabled={loading} onClick={handlePublish}
                  onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(200,151,58,0.4)"; }}}
                  onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; }}
                >{loading?"Publishing…":"Publish Opinion →"}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
