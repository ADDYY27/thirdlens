export default function BiasBar({
  stats,
  left: propLeft,
  center: propCenter,
  right: propRight,
  label: propLabel,
  size = "md",
  showLabels = false,
  className = "",
  style = {},
}) {
  const sanitize = (val) => {
    const num = Number(val);
    return !Number.isNaN(num) && num > 0 ? num : 0;
  };

  const left = sanitize(stats?.left ?? propLeft);
  const center = sanitize(stats?.center ?? propCenter);
  const right = sanitize(stats?.right ?? propRight);
  const label = stats?.label ?? propLabel;

  const ariaLabel = label
    ? `Bias: ${label} (${left}% Left, ${center}% Center, ${right}% Right)`
    : `Bias breakdown: ${left}% Left, ${center}% Center, ${right}% Right`;

  // Variant: sm (NewsCard display)
  if (size === "sm") {
    return (
      <div
        className={`bias-bar-container bias-bar-container-sm ${className}`}
        style={style}
        role="img"
        aria-label={ariaLabel}
      >
        <div
          className="bias-bar-track bias-bar-track-sm"
          style={{
            display: "flex",
            height: "3px",
            borderRadius: "2px",
            overflow: "hidden",
            marginBottom: showLabels && label ? "6px" : 0,
            background: "#ded5c5",
          }}
        >
          <div
            className="bias-bar-segment-left"
            style={{
              width: `${left}%`,
              transition: "width 0.8s",
            }}
          />
          <div
            className="bias-bar-segment-center"
            style={{
              width: `${center}%`,
              transition: "width 0.8s",
            }}
          />
          <div
            className="bias-bar-segment-right"
            style={{
              width: `${right}%`,
              transition: "width 0.8s",
            }}
          />
        </div>

        {showLabels && label && (
          <p
            style={{
              fontFamily: '"IBM Plex Mono", "Courier New", monospace',
              fontSize: "8px",
              letterSpacing: "0.07em",
              color: "#807668",
              margin: 0,
            }}
          >
            ◆ {label}
          </p>
        )}
      </div>
    );
  }

  // Variant: md (TrendingPage display)
  if (size === "md") {
    return (
      <div
        className={`bias-bar-container bias-bar-container-md ${className}`}
        style={style}
        role="img"
        aria-label={ariaLabel}
      >
        <div
          className="bias-bar-track bias-bar-track-md"
          style={{
            display: "flex",
            height: "48px",
            borderRadius: "3px",
            overflow: "hidden",
            marginBottom: "10px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          {[
            { pct: left, bg: "linear-gradient(135deg,#3b7dd8,#2563eb)", l: "LEFT", cl: "bias-bar-vibrant-left" },
            { pct: center, bg: "linear-gradient(135deg,#2da87a,#059669)", l: "CENTER", cl: "bias-bar-vibrant-center" },
            { pct: right, bg: "linear-gradient(135deg,#d84f3b,#dc2626)", l: "RIGHT", cl: "bias-bar-vibrant-right" },
          ].map(({ pct, bg, l, cl }) => (
            <div
              key={l}
              className={cl}
              style={{
                width: `${pct}%`,
                background: bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 900,
                minWidth: pct > 0 ? "32px" : "0",
                overflow: "hidden",
                transition: "width 0.8s",
                fontFamily: "'Courier New', monospace",
              }}
            >
              {pct > 10 && (
                <>
                  <span style={{ fontSize: "8px", letterSpacing: "0.15em" }}>{l}</span>
                  <span style={{ fontSize: "1rem" }}>{pct}%</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Variant: lg (DetailPage display)
  return (
    <div
      className={`bias-bar-container bias-bar-container-lg ${className}`}
      style={style}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        className="bias-bar-track bias-bar-track-lg"
        style={{
          display: "flex",
          height: "100px",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          marginBottom: "12px",
        }}
      >
        {[
          { label: "LEFT", pct: left, bg: "linear-gradient(135deg,#3b7dd8,#2563eb)", cl: "bias-bar-vibrant-left" },
          { label: "CENTER", pct: center, bg: "linear-gradient(135deg,#2da87a,#059669)", cl: "bias-bar-vibrant-center" },
          { label: "RIGHT", pct: right, bg: "linear-gradient(135deg,#d84f3b,#dc2626)", cl: "bias-bar-vibrant-right" },
        ].map(({ label: segmentLabel, pct, bg, cl }) => (
          <div
            key={segmentLabel}
            className={cl}
            style={{
              width: `${pct}%`,
              background: bg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 900,
              transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
              minWidth: pct > 0 ? "60px" : "0",
              overflow: "hidden",
            }}
          >
            {pct > 10 && (
              <>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    marginBottom: "6px",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {segmentLabel}
                </span>
                <span style={{ fontSize: "2rem" }}>{pct}%</span>
              </>
            )}
          </div>
        ))}
      </div>

      {showLabels && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          {[
            { l: "Left", p: left, c: "#3b7dd8" },
            { l: "Center", p: center, c: "#2da87a" },
            { l: "Right", p: right, c: "#d84f3b" },
          ].map(({ l, p, c }) => (
            <span
              key={l}
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "10px",
                color: c,
                letterSpacing: "0.1em",
              }}
            >
              {l} {p}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
