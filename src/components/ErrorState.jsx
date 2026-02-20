export default function ErrorState({ message, onRetry }) {
  return (
    <div style={{ textAlign:"center", padding:"80px 20px", maxWidth:"480px", margin:"0 auto" }}>
      <p style={{ fontSize:"3.5rem", marginBottom:"16px" }}>⚠️</p>
      <h3 style={{ fontFamily:"'Libre Baskerville',Georgia,serif", fontSize:"1.5rem", color:"#d84f3b", marginBottom:"12px" }}>Something went wrong</h3>
      <p style={{ fontFamily:"'Courier New',monospace", fontSize:"12px", color:"#6b6560", marginBottom:"28px", lineHeight:1.6 }}>{message}</p>
      <button onClick={onRetry} style={{ padding:"12px 28px", background:"linear-gradient(135deg,#c8973a,#e8b85a)", border:"none", borderRadius:"3px", color:"#0a0a0a", fontFamily:"'Courier New',monospace", fontSize:"11px", fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s" }}
        onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(200,151,58,0.4)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; }}
      >Retry</button>
    </div>
  );
}
