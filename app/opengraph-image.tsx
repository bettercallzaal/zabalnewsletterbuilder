import { ImageResponse } from "next/og";

export const alt = "ZABAL Newsletter Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#141e27",
          color: "#e8ecef",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, color: "#e0ddaa", fontWeight: 700 }}>
          ZM.
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, marginTop: 16 }}>
          Newsletter Builder
        </div>
        <div style={{ fontSize: 32, color: "#8ea0ad", marginTop: 20 }}>
          the ZAO daily-3 loop. 3 wins an issue, in voice.
        </div>
        <div style={{ fontSize: 24, color: "#c9c592", marginTop: 40 }}>
          - BetterCallZaal on behalf of the ZABAL Team
        </div>
      </div>
    ),
    { ...size }
  );
}
