import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function UserMenu({ onShowAuth }) {
  const { user, userProfile, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // ─────────────────────────────────────────────
  // SIGN IN STATE
  // ─────────────────────────────────────────────
  if (!user) {
    return (
      <button
        onClick={onShowAuth}
        style={{
          padding: "8px 18px",
          background: "transparent",
          border: "1px solid rgba(130, 95, 42, 0.34)",
          borderRadius: "2px",

          // IMPORTANT
          color: "#29251f",

          fontFamily:
            '"Cormorant Garamond", Georgia, serif',
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.09em",
          textTransform: "uppercase",

          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#8f672d";
          e.currentTarget.style.background =
            "rgba(167, 122, 53, 0.07)";
          e.currentTarget.style.borderColor =
            "rgba(130, 95, 42, 0.55)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#29251f";
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor =
            "rgba(130, 95, 42, 0.34)";
        }}
      >
        Sign In
      </button>
    );
  }

  // ─────────────────────────────────────────────
  // LOGGED-IN STATE
  // ─────────────────────────────────────────────

  const name =
    user.displayName ||
    userProfile?.displayName ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",

          background: "rgba(167, 122, 53, 0.06)",
          border: "1px solid rgba(130, 95, 42, 0.28)",
          borderRadius: "2px",

          color: "#29251f",

          fontFamily:
            '"Cormorant Garamond", Georgia, serif',
          fontSize: "14px",
          fontWeight: 600,

          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {/* Avatar */}
        <span
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",

            background:
              "linear-gradient(135deg, #c4a064, #a77a35)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "#171512",

            fontFamily:
              '"IBM Plex Mono", monospace',
            fontSize: "11px",
            fontWeight: 700,
          }}
        >
          {name[0].toUpperCase()}
        </span>

        {/* Name */}
        <span
          style={{
            color: "#29251f",
            fontFamily:
              '"Cormorant Garamond", Georgia, serif',
            fontSize: "14px",
            fontWeight: 600,

            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </span>

        {/* Arrow */}
        <span
          style={{
            color: "#8a7f6e",
            fontFamily:
              '"IBM Plex Mono", monospace',
            fontSize: "9px",
          }}
        >
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",

            minWidth: "210px",

            background: "#faf7ef",
            border:
              "1px solid rgba(130, 95, 42, 0.28)",
            borderRadius: "3px",

            boxShadow:
              "0 16px 40px rgba(40, 30, 15, 0.18)",

            zIndex: 300,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom:
                "1px solid rgba(130, 95, 42, 0.16)",
            }}
          >
            <p
              style={{
                margin: "0 0 3px",

                color: "#171512",

                fontFamily:
                  '"Cormorant Garamond", Georgia, serif',

                fontSize: "17px",
                fontWeight: 600,
              }}
            >
              {name}
            </p>

            <p
              style={{
                margin: 0,

                color: "#8a7f6e",

                fontFamily:
                  '"IBM Plex Mono", monospace',

                fontSize: "8px",
                letterSpacing: "0.04em",

                overflowWrap: "anywhere",
              }}
            >
              {user.email}
            </p>
          </div>

          <button
            onClick={async () => {
              setOpen(false);
              await logout();
            }}
            style={{
              width: "100%",
              padding: "12px 16px",

              background: "transparent",
              border: "none",

              textAlign: "left",

              color: "#8f672d",

              fontFamily:
                '"IBM Plex Mono", monospace',

              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",

              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}