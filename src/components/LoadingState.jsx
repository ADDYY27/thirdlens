export default function LoadingState() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"100px 20px" }}>
      <div style={{ width:"44px", height:"44px", borderRadius:"50%", border:"3px solid rgba(200,151,58,0.15)", borderTop:"3px solid #c8973a", animation:"spin 0.8s linear infinite", marginBottom:"24px" }} />
      <p style={{ fontFamily:"'Courier New',monospace", fontSize:"12px", color:"#6b6560", letterSpacing:"0.2em", textTransform:"uppercase", animation:"pulse 1.5s ease-in-out infinite" }}>
        Loading news from top sources…
      </p>
    </div>
  );
}
