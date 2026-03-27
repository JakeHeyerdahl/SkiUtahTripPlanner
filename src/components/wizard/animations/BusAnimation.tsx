"use client";

import { motion } from "framer-motion";

export default function BusAnimation({ active, memberCount }: { active: boolean; memberCount: number }) {
  const people = Math.min(memberCount, 5);

  return (
    <div className="relative w-full h-16 overflow-hidden flex items-end pb-1">
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300" />

      {/* Ski rack on bus roof with skis */}
      {/* Bus */}
      <motion.div
        className="absolute bottom-1 right-8"
        initial={{ x: 80 }}
        animate={active ? { x: 0 } : { x: 80 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
      >
        <svg width="110" height="44" viewBox="0 0 110 44" fill="none">
          {/* Bus body */}
          <rect x="2" y="6" width="106" height="30" rx="4" fill="#0D2240" />
          {/* Windows */}
          <rect x="10" y="11" width="14" height="10" rx="2" fill="#5BB8F5" opacity="0.8" />
          <rect x="30" y="11" width="14" height="10" rx="2" fill="#5BB8F5" opacity="0.8" />
          <rect x="50" y="11" width="14" height="10" rx="2" fill="#5BB8F5" opacity="0.8" />
          <rect x="70" y="11" width="14" height="10" rx="2" fill="#5BB8F5" opacity="0.8" />
          {/* Door */}
          <rect x="88" y="14" width="14" height="22" rx="2" fill="#1B6BB0" />
          <circle cx="89" cy="25" r="1.5" fill="#5BB8F5" />
          {/* Wheels */}
          <circle cx="22" cy="38" r="6" fill="#3D5066" />
          <circle cx="22" cy="38" r="3" fill="#8A9BB0" />
          <circle cx="80" cy="38" r="6" fill="#3D5066" />
          <circle cx="80" cy="38" r="3" fill="#8A9BB0" />
          {/* Headlights */}
          <rect x="2" y="16" width="6" height="4" rx="1" fill="#FFD580" />
          {/* Ski Utah logo area */}
          <rect x="10" y="25" width="70" height="8" rx="2" fill="#1B6BB0" />
          <text x="45" y="32" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">SKI UTAH</text>
          {/* Ski rack */}
          <rect x="10" y="4" width="80" height="3" rx="1" fill="#3D5066" />
          <line x1="20" y1="2" x2="20" y2="7" stroke="#3D5066" strokeWidth="1" />
          <line x1="40" y1="1" x2="40" y2="7" stroke="#0D2240" strokeWidth="1.5" />
          <line x1="44" y1="1" x2="44" y2="7" stroke="#0D2240" strokeWidth="1.5" />
          <line x1="60" y1="1" x2="60" y2="7" stroke="#0D2240" strokeWidth="1.5" />
          <line x1="64" y1="1" x2="64" y2="7" stroke="#0D2240" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* Family members walking toward bus */}
      {Array.from({ length: people }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-1"
          initial={{ x: `${10 + i * 10}%`, opacity: 0 }}
          animate={active
            ? { x: [`${10 + i * 8}%`, `${55 - i * 4}%`], opacity: [0, 1, 1, 0] }
            : { opacity: 0, x: `${10 + i * 8}%` }
          }
          transition={{ duration: 1.2, delay: i * 0.12, ease: "easeInOut" }}
        >
          <svg width="16" height="30" viewBox="0 0 16 30" fill="none">
            {/* Head */}
            <circle cx="8" cy={i % 2 === 0 ? 4 : 5} r={i % 2 === 0 ? 3.5 : 2.8}
              fill={["#FFD580", "#FFBF60", "#FFA040", "#FF8020", "#FFD580"][i]} />
            {/* Body */}
            <rect x="5" y={i % 2 === 0 ? 8 : 9} width="6" height={i % 2 === 0 ? 10 : 8} rx="2"
              fill={["#1B6BB0", "#0D2240", "#5BB8F5", "#1B6BB0", "#0D2240"][i]} />
            {/* Legs */}
            <motion.g
              animate={active ? { rotate: [0, 15, -15, 0] } : {}}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ transformOrigin: "8px 18px" }}
            >
              <line x1="6" y1={i % 2 === 0 ? 18 : 17} x2="4" y2={i % 2 === 0 ? 26 : 24}
                stroke="#0D2240" strokeWidth="2" />
              <line x1="10" y1={i % 2 === 0 ? 18 : 17} x2="12" y2={i % 2 === 0 ? 26 : 24}
                stroke="#0D2240" strokeWidth="2" />
            </motion.g>
            {/* Ski bag / backpack */}
            <rect x="11" y={i % 2 === 0 ? 8 : 9} width="4" height={i % 2 === 0 ? 8 : 6} rx="1"
              fill="#5BB8F5" opacity="0.7" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
