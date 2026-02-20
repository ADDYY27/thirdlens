import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function UserMenu({ onShowAuth }) {
  const { user, userProfile, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <button onClick={onShowAuth}
        style={{ padding:"8px 18px",background:"transparent",border:"1px solid rgba(200,151,58,0.4)",borderRadius:"3px",color:"#c8973a",fontFamily:"'Courier New',monospace",fontSize:"10px",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s" }}
        onMouseEnter={e=>{ e.currentTarget.style.background="rgba(200,151,58,0.1)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}
      >Sign In</button>
    );
  }

  const name = user.displayName || userProfile?.displayName || user.email?.split("@")[0] || "User";

  return (
    <div style={{ position:"relative" }}>
      <button onClick={()=>setOpen(!open)}
        style={{ display:"flex",alignItems:"center",gap:"8px",padding:"6px 12px",background:"rgba(200,151,58,0.08)",border:"1px solid rgba(200,151,58,0.25)",borderRadius:"3px",cursor:"pointer",transition:"all 0.2s" }}
        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(200,151,58,0.5)"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(200,151,58,0.25)"}
      >
        <div style={{ width:"26px",height:"26px",borderRadius:"50%",background:"linear-gradient(135deg,#c8973a,#e8b85a)",display:"flex",alignItems:"center",justifyContent:"center",color:"#0a0a0a",fontWeight:900,fontSize:"12px" }}>
          {name[0].toUpperCase()}
        </div>
        <span style={{ fontFamily:"'Courier New',monospace",fontSize:"10px",color:"#c8973a",fontWeight:700,letterSpacing:"0.05em",maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{name}</span>
        <span style={{ color:"#6b6560",fontSize:"10px" }}>{open?"▲":"▼"}</span>
      </button>

      {open && (
        <div style={{ position:"absolute",right:0,top:"calc(100% + 8px)",background:"#141410",border:"1px solid rgba(200,151,58,0.2)",borderRadius:"4px",minWidth:"180px",boxShadow:"0 16px 40px rgba(0,0,0,0.6)",zIndex:200,overflow:"hidden" }}
          onClick={()=>setOpen(false)}
        >
          <div style={{ padding:"14px 16px",borderBottom:"1px solid rgba(200,151,58,0.1)" }}>
            <p style={{ fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"0.9rem",color:"#faf6ef",fontWeight:600,marginBottom:"2px" }}>{name}</p>
            <p style={{ fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560",letterSpacing:"0.05em" }}>{user.email}</p>
          </div>
          <button onClick={logout}
            style={{ width:"100%",padding:"12px 16px",background:"transparent",border:"none",textAlign:"left",color:"#d84f3b",fontFamily:"'Courier New',monospace",fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(216,79,59,0.08)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >Sign Out</button>
        </div>
      )}
    </div>
  );
}
