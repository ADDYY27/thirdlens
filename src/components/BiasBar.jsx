export default function BiasBar({ left, center, right }) {
  return (
    <div>
      <div style={{ display:"flex", height:"20px", borderRadius:"3px", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>
        {[
          {pct:left,bg:"linear-gradient(135deg,#3b7dd8,#2563eb)",l:"LEFT"},
          {pct:center,bg:"linear-gradient(135deg,#2da87a,#059669)",l:"CENTER"},
          {pct:right,bg:"linear-gradient(135deg,#d84f3b,#dc2626)",l:"RIGHT"},
        ].map(({pct,bg,l})=>(
          <div key={l} style={{ width:`${pct}%`, background:bg, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontFamily:"'Courier New',monospace", fontSize:"9px", fontWeight:900, letterSpacing:"0.1em", transition:"width 0.8s", overflow:"hidden" }}>
            {pct>10&&l}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:"6px" }}>
        {[{l:"Left",p:left,c:"#3b7dd8"},{l:"Center",p:center,c:"#2da87a"},{l:"Right",p:right,c:"#d84f3b"}].map(({l,p,c})=>(
          <span key={l} style={{ fontFamily:"'Courier New',monospace", fontSize:"9px", color:c, letterSpacing:"0.05em" }}>{l} {p}%</span>
        ))}
      </div>
    </div>
  );
}
