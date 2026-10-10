"use client";

import { useEffect } from "react";

const STYLE_ID = "ai-icon-keyframes";

const ensureKeyframes = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes ai-clip{
      0%{clip-path:inset(0 100% 0 0)}
      1%{clip-path:inset(0 0 0 0)}
      50%{clip-path:inset(0 0 0 0)}
      85%,97%{clip-path:inset(0 100% 0 0)}
      98%{clip-path:inset(0 100% 0 0)}
      100%{clip-path:inset(0 100% 0 0)}
    }
    @keyframes ai-draw-line{
      0%{stroke-dashoffset:100}
      30%{stroke-dashoffset:0}
      97%{stroke-dashoffset:0}
      100%{stroke-dashoffset:100}
    }
    @keyframes ai-draw-arrow{
      0%,20%{stroke-dashoffset:100}
      38%{stroke-dashoffset:0}
      97%{stroke-dashoffset:0}
      100%{stroke-dashoffset:100}
    }
  `;
  document.head.appendChild(style);
};

interface AiIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function AiIcon({ size = 18, className, animated = false }: AiIconProps) {
  useEffect(() => {
    if (animated) ensureKeyframes();
  }, [animated]);

  if (!animated) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M2 17l6.5-6.5 5 5L22 7" />
        <path d="M16 7h6v6" />
      </svg>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        clipPath: "inset(0 100% 0 0)",
        animation: "ai-clip 3s ease-in-out infinite",
      }}
      className={className}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "100%", height: "100%" }}
      >
        <path
          d="M2 17l6.5-6.5 5 5L22 7"
          pathLength={100}
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: "ai-draw-line 3s cubic-bezier(.65,0,.35,1) infinite",
          }}
        />
        <path
          d="M16 7h6v6"
          pathLength={100}
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: "ai-draw-arrow 3s cubic-bezier(.65,0,.35,1) infinite",
          }}
        />
      </svg>
    </div>
  );
}
