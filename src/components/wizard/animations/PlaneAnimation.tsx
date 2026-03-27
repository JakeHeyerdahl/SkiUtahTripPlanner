"use client";

import { motion } from "framer-motion";

export default function PlaneAnimation({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-16 overflow-hidden">
      {/* Mountain horizon */}
      <svg viewBox="0 0 400 60" className="absolute bottom-0 w-full" preserveAspectRatio="none">
        <path d="M0,60 L0,35 L40,10 L80,30 L120,5 L160,25 L200,0 L240,20 L280,8 L320,28 L360,12 L400,30 L400,60 Z"
          fill="#E8ECF0" />
      </svg>
      {/* Runway line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300" />

      {/* Plane */}
      <motion.div
        className="absolute bottom-3"
        initial={{ x: -60, y: 0 }}
        animate={active
          ? { x: ["-10%", "30%", "110%"], y: [0, -32, -28], rotate: [0, -18, -12] }
          : { x: "-10%", y: 0, rotate: 0 }
        }
        transition={{ duration: 2.2, ease: "easeInOut", times: [0, 0.45, 1] }}
      >
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
          <path d="M2 12 L32 4 L44 10 L44 14 L32 20 L2 12Z" fill="#0D2240" />
          <path d="M18 12 L32 4 L32 20 Z" fill="#1B6BB0" />
          <path d="M26 12 L34 8 L36 12 L34 16 Z" fill="#5BB8F5" />
          <path d="M10 12 L18 9 L18 15 Z" fill="#1B6BB0" />
          <circle cx="38" cy="12" r="2" fill="#5BB8F5" />
        </svg>
      </motion.div>

      {/* Landing plane (comes in from right) */}
      <motion.div
        className="absolute bottom-3"
        initial={{ x: "120%", y: -24, rotate: 12 }}
        animate={active
          ? { x: ["120%", "75%", "60%"], y: [-24, -8, 0], rotate: [12, 6, 0] }
          : { x: "120%", y: -24, rotate: 12 }
        }
        transition={{ duration: 2, ease: "easeInOut", delay: 1.8, times: [0, 0.5, 1] }}
      >
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none" style={{ transform: "scaleX(-1)" }}>
          <path d="M2 12 L32 4 L44 10 L44 14 L32 20 L2 12Z" fill="#0D2240" />
          <path d="M18 12 L32 4 L32 20 Z" fill="#1B6BB0" />
          <path d="M26 12 L34 8 L36 12 L34 16 Z" fill="#5BB8F5" />
          <path d="M10 12 L18 9 L18 15 Z" fill="#1B6BB0" />
          <circle cx="38" cy="12" r="2" fill="#5BB8F5" />
        </svg>
      </motion.div>
    </div>
  );
}
