"use client";

import { motion } from "framer-motion";

export default function SkierAnimation({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-16 overflow-hidden">
      {/* Mountain silhouette */}
      <svg viewBox="0 0 400 60" className="absolute bottom-0 w-full" preserveAspectRatio="none">
        <path d="M0,60 L0,50 L60,20 L120,40 L180,5 L240,35 L300,15 L360,38 L400,20 L400,60 Z"
          fill="#0D2240" />
        {/* Snow caps */}
        <path d="M60,20 L45,35 L75,35 Z" fill="white" opacity="0.6" />
        <path d="M180,5 L162,22 L198,22 Z" fill="white" opacity="0.6" />
        <path d="M300,15 L284,28 L316,28 Z" fill="white" opacity="0.6" />
      </svg>

      {/* Skier */}
      <motion.div
        className="absolute"
        initial={{ x: "5%", y: 4, rotate: 15 }}
        animate={active
          ? {
              x: ["5%", "25%", "50%", "80%", "95%"],
              y: [4, 12, 6, 18, 8],
              rotate: [15, 10, 18, 8, 12],
            }
          : { x: "5%", y: 4, rotate: 15 }
        }
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          {/* Body */}
          <ellipse cx="14" cy="10" rx="4" ry="5" fill="#1B6BB0" />
          {/* Head */}
          <circle cx="14" cy="4" r="3" fill="#FFD580" />
          {/* Helmet */}
          <path d="M11,4 Q11,1 14,1 Q17,1 17,4" fill="#0D2240" />
          {/* Poles */}
          <line x1="8" y1="8" x2="4" y2="20" stroke="#5BB8F5" strokeWidth="1.5" />
          <line x1="20" y1="8" x2="24" y2="20" stroke="#5BB8F5" strokeWidth="1.5" />
          {/* Legs */}
          <line x1="12" y1="15" x2="8" y2="22" stroke="#0D2240" strokeWidth="2" />
          <line x1="16" y1="15" x2="20" y2="22" stroke="#0D2240" strokeWidth="2" />
          {/* Skis */}
          <line x1="4" y1="23" x2="14" y2="23" stroke="#0D2240" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="14" y1="23" x2="24" y2="23" stroke="#0D2240" strokeWidth="2.5" strokeLinecap="round" />
          {/* Snow spray */}
          <motion.g
            animate={active ? { opacity: [0, 1, 0], x: [-2, -6], y: [0, 3] } : { opacity: 0 }}
            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 0.3 }}
          >
            <circle cx="6" cy="24" r="1" fill="white" opacity="0.8" />
            <circle cx="4" cy="22" r="0.8" fill="white" opacity="0.6" />
            <circle cx="3" cy="25" r="0.6" fill="white" opacity="0.5" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
