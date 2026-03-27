"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const SEARCH_STEPS = [
  { icon: "🗓️", text: "Checking resort availability for your dates..." },
  { icon: "🎿", text: "Matching resorts to your pass & skill levels..." },
  { icon: "✈️", text: "Finding the best flights from your city..." },
  { icon: "🏨", text: "Sourcing top-rated lodging options..." },
  { icon: "❄️", text: "Calculating snow likelihood scores..." },
  { icon: "🍽️", text: "Curating dining for your group's taste..." },
  { icon: "🏔️", text: "Building your perfect Utah ski packages..." },
];

const TOTAL_DURATION = 5200; // ms

export default function BuildingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Advance steps
    const stepInterval = TOTAL_DURATION / SEARCH_STEPS.length;
    const timers = SEARCH_STEPS.map((_, i) =>
      setTimeout(() => setActiveStep(i), i * stepInterval)
    );

    // Progress bar
    const startTime = Date.now();
    const rafId = { current: 0 };
    function tick() {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
        setTimeout(() => router.push("/plan/packages"), 600);
      }
    }
    rafId.current = requestAnimationFrame(tick);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafId.current);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0D2240] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background mountains */}
      <div className="fixed inset-0 pointer-events-none">
        <svg viewBox="0 0 1440 900" className="absolute bottom-0 w-full opacity-10" preserveAspectRatio="xMidYMax slice">
          <path d="M0,900 L0,400 L180,200 L360,350 L540,120 L720,300 L900,80 L1080,280 L1260,160 L1440,320 L1440,900 Z" fill="#5BB8F5" />
        </svg>
        {/* Stars */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Ski Utah mark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            {/* Mountain icon */}
            <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
              <path d="M20 2L36 30H4L20 2Z" fill="#5BB8F5" />
              <path d="M20 2L28 16H12L20 2Z" fill="white" opacity="0.3" />
              <path d="M14 16L20 2L20 16Z" fill="white" opacity="0.15" />
            </svg>
            <span className="text-white text-xl font-black tracking-widest">SKI UTAH</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight">
            Building Your<br />
            <span className="text-[#5BB8F5]">Dream Ski Trip</span>
          </h1>
        </motion.div>

        {/* Animated search steps */}
        <div className="space-y-2 mb-12 min-h-[200px]">
          <AnimatePresence>
            {SEARCH_STEPS.map((step, i) => {
              const isActive = i === activeStep;
              const isDone = i < activeStep;
              if (i > activeStep + 1) return null;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{
                    opacity: isDone ? 0.45 : isActive ? 1 : 0,
                    x: 0,
                    height: "auto",
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                  style={{
                    background: isActive ? "rgba(91,184,245,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(91,184,245,0.25)" : "1px solid transparent",
                  }}
                >
                  <span className="text-xl">{step.icon}</span>
                  <span className={`text-sm font-medium ${isActive ? "text-white" : "text-[#5BB8F5]/60"}`}>
                    {step.text}
                  </span>
                  {isDone && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto text-[#5BB8F5] text-xs font-bold"
                    >
                      ✓
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      className="ml-auto flex gap-1"
                      animate={{}}
                    >
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-1.5 h-1.5 rounded-full bg-[#5BB8F5]"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.2 }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #1B6BB0, #5BB8F5)",
              }}
            />
          </div>
          <p className="text-[#5BB8F5]/60 text-xs mt-2 font-medium">
            {done ? "Ready!" : `${Math.round(progress)}%`}
          </p>
        </div>

        {/* Done transition */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <p className="text-white font-black text-2xl">🎉 Your packages are ready!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
