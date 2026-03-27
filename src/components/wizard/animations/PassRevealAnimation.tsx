"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PassType } from "@/context/TripContext";

const PASS_CONFIG: Record<PassType, { catchphrase: string; color: string; accent: string; tagline: string }> = {
  "ikon": {
    catchphrase: "More Mountain.",
    tagline: "More Adventure.",
    color: "#C4262E",
    accent: "#FF6B35",
  },
  "ikon-base": {
    catchphrase: "Your Season.",
    tagline: "Your Mountain.",
    color: "#C4262E",
    accent: "#FF6B35",
  },
  "epic": {
    catchphrase: "Go Epic.",
    tagline: "The world is yours.",
    color: "#0057A8",
    accent: "#00A8E8",
  },
  "epic-local": {
    catchphrase: "Go Local.",
    tagline: "Epic experiences, closer to home.",
    color: "#0057A8",
    accent: "#00A8E8",
  },
  "mountain-collective": {
    catchphrase: "Independent",
    tagline: "by Nature.",
    color: "#1A5C3A",
    accent: "#4CAF50",
  },
  "indy": {
    catchphrase: "Ski Independent.",
    tagline: "Support the resorts you love.",
    color: "#6B2FA0",
    accent: "#9C4DCC",
  },
};

export default function PassRevealAnimation({ active, passType }: { active: boolean; passType: PassType | null }) {
  if (!passType) return <div className="h-16" />;
  const config = PASS_CONFIG[passType];

  return (
    <div className="relative w-full h-16 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {active && (
          <>
            {/* Background pulse */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.12, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ backgroundColor: config.color }}
            />
            {/* Catchphrase */}
            <motion.div
              className="relative text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span
                className="text-lg font-black tracking-tight mr-2"
                style={{ color: config.color }}
              >
                {config.catchphrase}
              </span>
              <span className="text-lg font-light tracking-tight" style={{ color: config.accent }}>
                {config.tagline}
              </span>
            </motion.div>
            {/* Sparkles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? config.color : config.accent,
                  left: `${20 + i * 15}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [-8, -20] }}
                transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
