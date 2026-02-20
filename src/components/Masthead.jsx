export default function Masthead() {
  return (
    <header style={{
      background: "linear-gradient(180deg, #060606 0%, #0f0f0f 60%, #1a1208 100%)",
      borderBottom: "1px solid rgba(200,151,58,0.3)",
      padding: "40px 0 32px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background texture lines */}
      <div style={{
        position:"absolute", inset:0, opacity:0.04,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(200,151,58,1) 28px, rgba(200,151,58,1) 29px)",
        pointerEvents:"none"
      }} />

      {/* Top gold line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg,transparent,#c8973a,transparent)" }} />

      <div style={{ position:"relative", zIndex:1 }}>
        {/* Edition line */}
        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "10px",
          letterSpacing: "0.35em",
          color: "rgba(200,151,58,0.6)",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          Est. 2024 &nbsp;·&nbsp; Vol. I &nbsp;·&nbsp; Independent Media Analysis
        </p>

        {/* Main title */}
        <h1 className="gold-shimmer" style={{
          fontFamily: "'UnifrakturMaguntia', cursive",
          fontSize: "clamp(48px, 8vw, 88px)",
          fontWeight: 400,
          letterSpacing: "4px",
          lineHeight: 1,
          marginBottom: "16px",
          display: "block",
        }}>
          The Third Lens
        </h1>

        {/* Double rule */}
        <div style={{ maxWidth:"520px", margin:"0 auto 16px" }}>
          <hr className="gold-rule-double" />
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: "13px",
          fontStyle: "italic",
          color: "rgba(200,151,58,0.75)",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
        }}>
          Beyond Left and Right.
        </p>
      </div>

      {/* Bottom gold line */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,#c8973a 30%,#c8973a 70%,transparent)" }} />
    </header>
  );
}
