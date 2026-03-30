"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Snowflake } from "lucide-react";

const BOOKING_STEPS = [
  "Securing your hotel reservation...",
  "Confirming flights with airline...",
  "Validating pass access at resorts...",
  "Reserving restaurant tables...",
  "Sending your itinerary...",
];

const SNOWFLAKES = Array.from({ length: 30 });

// Deep pow shot — full-screen background for confirmation
const POW_PHOTO = "/confirmation-page.jpg";

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
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center px-6">

      <AnimatePresence mode="wait">
        {phase === "booking" ? (
          /* ── Booking loading state ── */
          <motion.div
            key="booking"
            className="absolute inset-0 bg-[#0D2240] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5 }}
          >
            {/* Falling snowflakes */}
            {SNOWFLAKES.map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/20 pointer-events-none select-none"
                style={{ left: `${(i * 3.4) % 100}%`, top: "-5%" }}
                animate={{ top: "110%", opacity: [0, 0.4, 0.4, 0], rotate: 360 }}
                transition={{ duration: 4 + (i % 4), delay: i * 0.2, repeat: Infinity, ease: "linear" }}
              >
                ❄
              </motion.div>
            ))}

            {/* Mountain silhouette */}
            <div className="absolute inset-0 pointer-events-none">
              <svg viewBox="0 0 1440 900" className="absolute bottom-0 w-full opacity-10" preserveAspectRatio="xMidYMax slice">
                <path d="M0,900 L0,400 L200,180 L400,340 L600,100 L800,280 L1000,60 L1200,250 L1440,140 L1440,900 Z" fill="#5BB8F5" />
              </svg>
            </div>

            <div className="relative z-10 w-full max-w-md text-center">
              {/* Ski Utah logo */}
              <div className="flex items-center justify-center mb-8">
                <Image
                  src="/ski-utah-logo.svg"
                  alt="Ski Utah"
                  width={160}
                  height={50}
                  className="brightness-0 invert"
                  priority
                />
              </div>

              <h2 className="text-white text-3xl font-black mb-2">Booking your trip...</h2>
              <p className="text-[#5BB8F5]/70 text-sm mb-10">Hang tight, we&apos;re putting it all together</p>

              {/* Steps */}
              <div className="space-y-3 mb-8 text-left">
                {BOOKING_STEPS.map((step, i) => {
                  const isActive = i === activeStep;
                  const isDone = i < activeStep;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                        transition={isActive ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                        className="flex-shrink-0"
                      >
                        <Snowflake
                          size={16}
                          strokeWidth={2}
                          className={isActive ? "text-white" : isDone ? "text-white/30" : "text-white/15"}
                        />
                      </motion.div>
                      <span className={`text-sm font-medium transition-colors ${
                        isActive ? "text-white" : isDone ? "text-white/30" : "text-white/15"
                      }`}>
                        {step}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#1B6BB0] to-[#5BB8F5]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Confirmed state — full-screen pow background ── */
          <motion.div
            key="confirmed"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Full-screen pow photo */}
            <Image
              src={POW_PHOTO}
              alt="Skier ripping powder"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />

            {/* Dark overlay — stronger at bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-end pb-16 px-6">
              {/* Ski Utah logo at top */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-10 left-1/2 -translate-x-1/2"
              >
                <Image
                  src="/ski-utah-logo.svg"
                  alt="Ski Utah"
                  width={140}
                  height={44}
                  className="brightness-0 invert"
                />
              </motion.div>

              <div className="w-full max-w-md text-center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3"
                >
                  Booking confirmed
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="text-5xl font-black text-white leading-tight mb-2 drop-shadow-lg"
                >
                  You&apos;re going<br />skiing!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-white/70 text-base mb-8"
                >
                  Utah&apos;s mountains are waiting for you
                </motion.p>

                {/* Confirmation card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/15 backdrop-blur-md rounded-3xl p-5 mb-6 text-left space-y-2.5 border border-white/20"
                >
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Confirmation #</span>
                    <span className="text-white font-bold text-sm">SKI-2026-{Math.floor(Math.random() * 90000 + 10000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Trip Dates</span>
                    <span className="text-white font-bold text-sm">Jan 13–20, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Resort</span>
                    <span className="text-white font-bold text-sm">Park City + Cottonwood Canyons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Hotel</span>
                    <span className="text-white font-bold text-sm">Grand Summit Hotel</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2.5">
                    <span className="text-white font-bold">Total Charged</span>
                    <span className="text-[#5BB8F5] font-black text-lg">$6,840</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="space-y-3"
                >
                  <p className="text-white/50 text-xs">
                    A confirmation email has been sent with your full itinerary.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full py-4 rounded-2xl bg-white text-[#0D2240] font-black text-base hover:bg-[#5BB8F5] transition-colors"
                  >
                    Plan Another Trip →
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
