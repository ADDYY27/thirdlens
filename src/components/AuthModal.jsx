import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const S = {
    overlay: { position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",animation:"fadeUp 0.3s ease" },
    box: { background:"linear-gradient(160deg,#161410,#111)",border:"1px solid rgba(200,151,58,0.25)",borderRadius:"6px",width:"100%",maxWidth:"440px",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(200,151,58,0.08)" },
    header: { padding:"32px 32px 0",textAlign:"center" },
    tabRow: { display:"flex",gap:"0",marginBottom:"28px",borderBottom:"1px solid rgba(200,151,58,0.15)" },
    tab: (active) => ({ flex:1,padding:"12px",background:"transparent",border:"none",borderBottom: active?"2px solid #c8973a":"2px solid transparent",color: active?"#c8973a":"#6b6560",fontFamily:"'Courier New',monospace",fontSize:"11px",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s",marginBottom:"-1px" }),
    body: { padding:"0 32px 32px" },
    label: { display:"block",fontFamily:"'Courier New',monospace",fontSize:"9px",color:"#6b6560",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"8px",marginTop:"16px" },
    input: { width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(200,151,58,0.2)",borderRadius:"3px",color:"#faf6ef",fontFamily:"'Courier New',monospace",fontSize:"13px",outline:"none",transition:"all 0.2s",boxSizing:"border-box" },
    btn: { width:"100%",padding:"14px",background:"linear-gradient(135deg,#c8973a,#e8b85a)",border:"none",borderRadius:"3px",color:"#0a0a0a",fontFamily:"'Courier New',monospace",fontSize:"12px",fontWeight:900,letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",marginTop:"20px",transition:"all 0.2s",boxShadow:"0 4px 20px rgba(200,151,58,0.3)" },
    gBtn: { width:"100%",padding:"12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(200,151,58,0.2)",borderRadius:"3px",color:"#faf6ef",fontFamily:"'Courier New',monospace",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",marginTop:"12px",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px" },
    error: { marginTop:"12px",padding:"10px 14px",background:"rgba(216,79,59,0.1)",border:"1px solid rgba(216,79,59,0.3)",borderRadius:"3px",color:"#d84f3b",fontFamily:"'Courier New',monospace",fontSize:"11px",letterSpacing:"0.05em" },
    close: { position:"absolute",top:"16px",right:"16px",width:"32px",height:"32px",background:"transparent",border:"1px solid rgba(200,151,58,0.2)",borderRadius:"50%",color:"#6b6560",fontSize:"14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s" },
  };

  const handle = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const onFocus = e => { e.target.style.border="1px solid rgba(200,151,58,0.6)"; e.target.style.background="rgba(200,151,58,0.04)"; };
  const onBlur  = e => { e.target.style.border="1px solid rgba(200,151,58,0.2)"; e.target.style.background="rgba(255,255,255,0.04)"; };

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else {
        if (!form.name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        await signup(form.email, form.password, form.name.trim());
      }
      onClose();
    } catch (err) {
      const msgs = {
        "auth/invalid-email": "Invalid email address.",
        "auth/wrong-password": "Incorrect password. Use 'Forgot password?' below.",
        "auth/invalid-credential": "Wrong email or password. Try again or reset your password.",
        "auth/user-not-found": "No account found. Please create one.",
        "auth/email-already-in-use": "Email already registered. Try signing in instead.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/too-many-requests": "Too many attempts. Please wait a moment.",
      };
      setError(msgs[err.code] || err.message);
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setError(""); setLoading(true);
    try { await loginWithGoogle(); onClose(); }
    catch (err) { setError("Google sign-in failed. Try again."); }
    setLoading(false);
  }

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.box, position:"relative" }}>
        {/* Close */}
        <button style={S.close} onClick={onClose}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(216,79,59,0.5)"; e.currentTarget.style.color="#d84f3b"; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(200,151,58,0.2)"; e.currentTarget.style.color="#6b6560"; }}
        >✕</button>

        {/* Header */}
        <div style={S.header}>
          <h2 style={{ fontFamily:"'UnifrakturMaguntia',cursive",fontSize:"2rem",color:"#faf6ef",marginBottom:"6px" }}>The Third Lens</h2>
          <p style={{ fontFamily:"'Courier New',monospace",fontSize:"10px",color:"#6b6560",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"24px" }}>
            Your voice. Your perspective.
          </p>

          {/* Tabs */}
          <div style={S.tabRow}>
            <button style={S.tab(mode==="login")} onClick={()=>{ setMode("login"); setError(""); }}>Sign In</button>
            <button style={S.tab(mode==="signup")} onClick={()=>{ setMode("signup"); setError(""); }}>Create Account</button>
          </div>
        </div>

        {/* Body */}
        <div style={S.body}>
          {mode === "signup" && (
            <>
              <label style={S.label}>Your Name</label>
              <input style={S.input} type="text" placeholder="e.g. Arjun Sharma" value={form.name} onChange={handle("name")} onFocus={onFocus} onBlur={onBlur} />
            </>
          )}
          <label style={S.label}>Email Address</label>
          <input style={S.input} type="email" placeholder="you@example.com" value={form.email} onChange={handle("email")} onFocus={onFocus} onBlur={onBlur} />
          <label style={S.label}>Password</label>
          <input style={S.input} type="password" placeholder={mode==="signup" ? "Min. 6 characters" : "Your password"} value={form.password} onChange={handle("password")} onFocus={onFocus} onBlur={onBlur}
            onKeyDown={e => e.key==="Enter" && handleSubmit()} />

          {mode === "login" && (
            <div style={{ textAlign:"right", marginTop:"8px" }}>
              {resetSent ? (
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:"10px", color:"#2da87a", letterSpacing:"0.05em" }}>
                  ✓ Reset email sent — check your inbox
                </span>
              ) : (
                <span
                  style={{ fontFamily:"'Courier New',monospace", fontSize:"10px", color:"#c8973a", cursor:"pointer", letterSpacing:"0.05em", textDecoration:"underline" }}
                  onClick={async () => {
                    if (!form.email) { setError("Enter your email above first."); return; }
                    try { await resetPassword(form.email); setResetSent(true); setError(""); }
                    catch { setError("Could not send reset email. Check the address."); }
                  }}
                >Forgot password?</span>
              )}
            </div>
          )}

          {error && <div style={S.error}>⚠ {error}</div>}

          <button style={S.btn} disabled={loading} onClick={handleSubmit}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(200,151,58,0.45)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 20px rgba(200,151,58,0.3)"; }}
          >
            {loading ? "Please wait…" : mode==="login" ? "Sign In →" : "Create Account →"}
          </button>

          <button style={S.gBtn} onClick={handleGoogle} disabled={loading}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor="rgba(200,151,58,0.4)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(200,151,58,0.2)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          <p style={{ textAlign:"center",fontFamily:"'Courier New',monospace",fontSize:"10px",color:"#6b6560",marginTop:"20px",letterSpacing:"0.05em",lineHeight:1.6 }}>
            {mode==="login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <span style={{ color:"#c8973a",cursor:"pointer",textDecoration:"underline" }} onClick={()=>{ setMode(mode==="login"?"signup":"login"); setError(""); }}>
              {mode==="login" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
