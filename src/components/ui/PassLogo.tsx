import Image from "next/image";
import { useState } from "react";
import { PassType } from "@/context/TripContext";

interface PassLogoProps {
  passType: PassType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Real CDN logo URLs sourced from each pass's official website
const PASS_LOGOS: Record<PassType, { src: string; alt: string; useImg: boolean }> = {
  "ikon": {
    src: "https://images.contentful.com/ycpblqmln66n/4c1bFg8G3Y4yQYOcqieimw/f091790a52c5d7a29286da31f418817c/Ikon_Logo_PNG-03.png",
    alt: "Ikon Pass",
    useImg: true,
  },
  "ikon-base": {
    src: "https://images.contentful.com/ycpblqmln66n/4c1bFg8G3Y4yQYOcqieimw/f091790a52c5d7a29286da31f418817c/Ikon_Logo_PNG-03.png",
    alt: "Ikon Base Pass",
    useImg: true,
  },
  "mountain-collective": {
    src: "https://mountaincollective.com/wp-content/uploads/2022/11/mountain-collective.svg",
    alt: "Mountain Collective",
    useImg: true,
  },
  "indy": {
    src: "https://www.indyskipass.com/themes/custom/origin/logo.svg",
    alt: "Indy Pass",
    useImg: true,
  },
  // Epic Pass — no accessible CDN URL found, use branded SVG
  "epic": {
    src: "epic",
    alt: "Epic Pass",
    useImg: false,
  },
  "epic-local": {
    src: "epic-local",
    alt: "Epic Local Pass",
    useImg: false,
  },
};

const SIZE_MAP = {
  sm: { w: 64, h: 24, container: "h-6" },
  md: { w: 96, h: 32, container: "h-8" },
  lg: { w: 128, h: 40, container: "h-10" },
};

// Inline SVG for Epic Pass (Vail Resorts blue brand)
function EpicPassSVG({ isLocal, size }: { isLocal: boolean; size: "sm" | "md" | "lg" }) {
  const heights = { sm: 24, md: 32, lg: 40 };
  const h = heights[size];
  const w = h * 3.2;
  return (
    <svg width={w} height={h} viewBox="0 0 128 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="40" rx="4" fill="#0057A8" />
      <text x="16" y="27" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="20" fill="white" letterSpacing="-0.5">
        EPIC
      </text>
      {isLocal && (
        <text x="76" y="27" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="12" fill="white" opacity="0.85">
          LOCAL
        </text>
      )}
    </svg>
  );
}

export default function PassLogo({ passType, size = "md", className = "" }: PassLogoProps) {
  const config = PASS_LOGOS[passType];
  const dims = SIZE_MAP[size];

  if (!config.useImg) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <EpicPassSVG isLocal={passType === "epic-local"} size={size} />
      </div>
    );
  }

  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#222" }}>{config.alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center ${dims.container} ${className}`} style={{ width: dims.w }}>
      <Image
        src={config.src}
        alt={config.alt}
        fill
        className="object-contain object-left"
        sizes={`${dims.w}px`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
