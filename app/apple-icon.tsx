import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#003366",
        borderRadius: 40,
      }}
    >
      <svg width={128} height={128} viewBox="0 0 26 26" fill="none">
        {/* steeple */}
        <path d="M13 1.5 L15 6 H11 Z" fill="#CBB67C" />
        <rect x="12.1" y="6" width="1.8" height="8" fill="#F9FAFB" />
        {/* body */}
        <path
          d="M4 26 V14 L13 7 L22 14 V26 Z"
          fill="#F9FAFB"
          opacity="0.95"
        />
        {/* doorway */}
        <path
          d="M9.5 26 V17.5 A3.5 3.5 0 0 1 16.5 17.5 V26 Z"
          fill="#003366"
        />
        {/* side windows */}
        <rect x="6.4" y="15.5" width="1.6" height="3.5" rx="0.8" fill="#CBB67C" opacity="0.9" />
        <rect x="18" y="15.5" width="1.6" height="3.5" rx="0.8" fill="#CBB67C" opacity="0.9" />
      </svg>
    </div>,
    size,
  );
}
