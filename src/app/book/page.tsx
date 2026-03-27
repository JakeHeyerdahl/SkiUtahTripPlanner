"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const BOOKING_STEPS = [
  "Securing your hotel reservation...",
  "Confirming flights with airline...",
  "Validating pass access at resorts...",
  "Reserving restaurant tables...",
  "Sending your itinerary...",
];

const SNOWFLAKES = Array.from({ length: 30 });

export default function BookPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"booking" | "confirmed">("booking");
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 600;
    const stepTimers = BOOKING_STEPS.map((_, i) =>
      setTimeout(() => setActiveStep(i), i * stepDuration)
    );

    const startTime = Date.now();
    const totalDuration = BOOKING_STEPS.length * stepDuration + 400;
    const rafId = { current: 0 };

    function tick() {
      const pct = Math.min(((Date.now() - startTime) / totalDuration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setPhase("confirmed");
      }
    }
    rafId.current = requestAnimationFrame(tick);

    return () => {
      stepTimers.forEach(clearTimeout);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0D2240] flex items-center justify-center px-6 overflow-hidden relative">
      {/* Snowflakes */}
      {SNOWFLAKES.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/20 text-xl pointer-events-none select-none"
          style={{ left: `${(i * 3.4) % 100}%` }}
          initial={{ top: "-5%", opacity: 0 }}
          animate={phase === "confirmed"
            ? { top: "110%", opacity: [0, 0.6, 0.6, 0], rotate: 360 }
            : { top: "-5%", opacity: 0 }
          }
          transition={{ duration: 3 + (i % 4), delay: i * 0.15, ease: "linear" }}
        >
          ❄️
        </motion.div>
      ))}

      {/* Mountain bg */}
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 1440 900" className="absolute bottom-0 w-full opacity-10" preserveAspectRatio="xMidYMax slice">
          <path d="M0,900 L0,400 L200,180 L400,340 L600,100 L800,280 L1000,60 L1200,250 L1440,140 L1440,900 Z" fill="#5BB8F5" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          {phase === "booking" ? (
            <motion.div
              key="booking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Ski Utah mark */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
                  <path d="M18 2L34 26H2L18 2Z" fill="#5BB8F5" />
                  <path d="M18 2L26 14H10L18 2Z" fill="white" opacity="0.3" />
                </svg>
                <span className="text-white text-lg font-black tracking-widest">SKI UTAH</span>
              </div>

              <h2 className="text-white text-3xl font-black mb-2">Booking your trip...</h2>
              <p className="text-[#5BB8F5]/70 text-sm mb-10">Hang tight, we&apos;re putting it all together</p>

              {/* Steps */}
              <div className="space-y-2 mb-8">
                {BOOKING_STEPS.map((step, i) => {
                  const isDone = i < activeStep;
                  const isCurrent = i === activeStep;
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                      style={{ background: isCurrent ? "rgba(91,184,245,0.1)" : "transparent" }}
                      animate={{ opacity: i > activeStep ? 0.3 : 1 }}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDone ? "bg-[#5BB8F5]" : isCurrent ? "border-2 border-[#5BB8F5]" : "border border-white/20"
                      }`}>
                        {isDone && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                        {isCurrent && (
                          <motion.div
                            className="w-2 h-2 rounded-full bg-[#5BB8F5]"
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <span className={`text-sm ${isCurrent ? "text-white font-semibold" : "text-[#5BB8F5]/60"}`}>
                        {step}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress */}
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#1B6BB0] to-[#5BB8F5]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center"
            >
              {/* Big emoji burst */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-7xl mb-6"
              >
                🎉
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-white mb-3"
              >
                You&apos;re going skiing!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#5BB8F5] text-lg mb-8"
              >
                Utah&apos;s mountains are waiting for you ⛷️
              </motion.p>

              {/* Confirmation card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-8 text-left space-y-3"
              >
                <div className="flex justify-between">
                  <span className="text-[#5BB8F5] text-sm">Confirmation #</span>
                  <span className="text-white font-bold text-sm">SKI-2026-{Math.floor(Math.random() * 90000 + 10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5BB8F5] text-sm">Trip Dates</span>
                  <span className="text-white font-bold text-sm">Jan 13–20, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5BB8F5] text-sm">Resort</span>
                  <span className="text-white font-bold text-sm">Park City + Cottonwood Canyons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5BB8F5] text-sm">Hotel</span>
                  <span className="text-white font-bold text-sm">Grand Summit Hotel</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="text-white font-bold">Total Charged</span>
                  <span className="text-[#5BB8F5] font-black text-lg">$6,840</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-3"
              >
                <p className="text-white/60 text-xs">
                  A confirmation email has been sent with your full itinerary.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="w-full py-4 rounded-2xl bg-[#5BB8F5] text-[#0D2240] font-black text-base hover:bg-white transition-colors"
                >
                  Plan Another Trip →
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
