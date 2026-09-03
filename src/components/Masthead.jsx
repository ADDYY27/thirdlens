export default function Masthead() {
  return (
    <header
      style={{
        background: "#f4efe4",
        color: "#171512",
        borderBottom: "1px solid rgba(130,95,42,0.28)",
        padding: "28px 20px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Paper texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 30px,
              rgba(100,75,35,0.045) 30px,
              rgba(100,75,35,0.045) 31px
            )
          `,
          pointerEvents: "none",
        }}
      />

      {/* Soft paper glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.42), transparent 68%)",
          pointerEvents: "none",
        }}
      />

      {/* Top gold rule */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(167,122,53,0.55), transparent)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Edition line */}
        <p
          style={{
            fontFamily: '"IBM Plex Mono", "Courier New", monospace',
            fontSize: "8px",
            fontWeight: 500,
            letterSpacing: "0.34em",
            color: "#927342",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          Est. 2024&nbsp;&nbsp;·&nbsp;&nbsp;Vol. I&nbsp;&nbsp;·&nbsp;&nbsp;
          Independent Media Analysis
        </p>

        {/* Newspaper title */}
        <h1
          className="masthead-title"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(58px, 7vw, 98px)",
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
            color: "#171512",
            margin: "0 0 16px",
          }}
        >
          The Third Lens
        </h1>

        {/* Main divider */}
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            margin: "0 auto 14px",
          }}
        >
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(167,122,53,0.45), transparent)",
              position: "relative",
            }}
          />

          <div
            style={{
              width: "100%",
              height: "1px",
              marginTop: "5px",
              background:
                "linear-gradient(90deg, transparent, rgba(167,122,53,0.18), transparent)",
            }}
          />
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: "13px",
            fontWeight: 600,
            fontStyle: "italic",
            color: "#96713d",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          Beyond Left and Right.
        </p>
      </div>

      {/* Bottom rule */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(167,122,53,0.5) 30%, rgba(167,122,53,0.5) 70%, transparent)",
        }}
      />
    </header>
  );
}