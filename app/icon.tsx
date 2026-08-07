import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        backgroundColor: "#003366",
        borderRadius: 6,
        padding: "2px 3px",
      }}
    >
      <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
        {/* steeple */}
        <path d="M13 2 L14.5 5 H11.5 Z" fill="#CBB67C" />
        <rect x="12.2" y="5" width="1.6" height="7" fill="#F9FAFB" />
        {/* body */}
        <path
          d="M5 26 V13 L13 7 L21 13 V26 Z"
          fill="#F9FAFB"
          opacity="0.95"
        />
        {/* doorway */}
        <path
          d="M10 26 V18.5 A3 3 0 0 1 16 18.5 V26 Z"
          fill="#003366"
        />
        {/* side windows */}
        <rect x="7" y="14.5" width="1.4" height="3" rx="0.7" fill="#CBB67C" opacity="0.9" />
        <rect x="17.6" y="14.5" width="1.4" height="3" rx="0.7" fill="#CBB67C" opacity="0.9" />
      </svg>
    </div>,
    size,
  );
}
