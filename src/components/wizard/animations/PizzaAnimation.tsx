"use client";

import { motion } from "framer-motion";

export default function PizzaAnimation({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-16 overflow-hidden flex items-center justify-center">
      {/* Chef */}
      <motion.div
        className="absolute"
        style={{ left: "35%", bottom: 2 }}
        animate={active ? { y: [0, -4, 0, -4, 0] } : {}}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="28" height="42" viewBox="0 0 28 42" fill="none">
          {/* Chef hat */}
          <rect x="6" y="6" width="16" height="10" rx="2" fill="white" stroke="#E8ECF0" strokeWidth="0.5" />
          <ellipse cx="14" cy="6" rx="9" ry="5" fill="white" stroke="#E8ECF0" strokeWidth="0.5" />
          {/* Head */}
          <circle cx="14" cy="18" r="5" fill="#FFD580" />
          {/* Body */}
          <rect x="8" y="23" width="12" height="12" rx="2" fill="white" stroke="#E8ECF0" strokeWidth="0.5" />
          {/* Arms */}
          <line x1="8" y1="25" x2="2" y2="20" stroke="#FFD580" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="25" x2="26" y2="20" stroke="#FFD580" strokeWidth="2.5" strokeLinecap="round" />
          {/* Hand palm up (toss) */}
          <circle cx="26" cy="19" r="2.5" fill="#FFD580" />
        </svg>
      </motion.div>

      {/* Flying pizza */}
      <motion.div
        className="absolute"
        style={{ left: "50%", translateX: "-50%" }}
        animate={active
          ? {
              y: [20, -16, -24, -12, 20],
              rotate: [0, 120, 240, 360, 480],
              x: [0, 8, 0, -8, 0],
            }
          : { y: 20, rotate: 0 }
        }
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Pizza base */}
          <circle cx="16" cy="16" r="14" fill="#F4A460" />
          {/* Crust */}
          <circle cx="16" cy="16" r="14" fill="none" stroke="#D2691E" strokeWidth="3" />
          {/* Sauce */}
          <circle cx="16" cy="16" r="10" fill="#CC2200" opacity="0.85" />
          {/* Cheese */}
          <circle cx="16" cy="16" r="8" fill="#FFD700" opacity="0.7" />
          {/* Toppings */}
          <circle cx="13" cy="13" r="2" fill="#CC2200" />
          <circle cx="19" cy="12" r="2" fill="#CC2200" />
          <circle cx="12" cy="19" r="2" fill="#CC2200" />
          <circle cx="20" cy="20" r="2" fill="#CC2200" />
          <circle cx="16" cy="16" r="2" fill="#2E7D32" opacity="0.8" />
          {/* Slice lines */}
          <line x1="16" y1="2" x2="16" y2="30" stroke="#D2691E" strokeWidth="0.8" opacity="0.5" />
          <line x1="2" y1="16" x2="30" y2="16" stroke="#D2691E" strokeWidth="0.8" opacity="0.5" />
          <line x1="6" y1="6" x2="26" y2="26" stroke="#D2691E" strokeWidth="0.8" opacity="0.5" />
          <line x1="26" y1="6" x2="6" y2="26" stroke="#D2691E" strokeWidth="0.8" opacity="0.5" />
        </svg>
      </motion.div>

      {/* Steam lines */}
      {active && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${42 + i * 8}%`, bottom: 20 }}
          animate={{ y: [-4, -16], opacity: [0.6, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
        >
          <svg width="6" height="16" viewBox="0 0 6 16">
            <path d="M3,16 Q5,10 3,8 Q1,6 3,0" stroke="#FFB347" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
