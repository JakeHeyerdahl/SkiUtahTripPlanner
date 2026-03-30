"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Snowflake,
  Map,
  Hotel,
  Plane,
  Calendar,
  Utensils,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const STEPS = [
  {
    icon: Map,
    number: "01",
    title: "Tell us about your trip",
    body: "Dates, group size, skill levels, budget, and which pass you hold. Takes about 2 minutes.",
  },
  {
    icon: Snowflake,
    number: "02",
    title: "We match you to resorts",
    body: "Our planner ranks Utah's 15 resorts by snow likelihood, terrain fit, and pass compatibility.",
  },
  {
    icon: Hotel,
    number: "03",
    title: "Pick your package",
    body: "Choose from curated options with lodging, flights, and lift tickets already bundled in.",
  },
  {
    icon: Calendar,
    number: "04",
    title: "Get your full itinerary",
    body: "A day-by-day plan with dining, activities, gear, and an AI concierge for any questions.",
  },
];

const INCLUDES = [
  { icon: Snowflake, label: "Resort & lift ticket recommendations" },
  { icon: Hotel, label: "Lodging matched to your budget" },
  { icon: Plane, label: "Flight options from your airport" },
  { icon: Utensils, label: "On-mountain dining picks" },
  { icon: Calendar, label: "Day-by-day itinerary" },
  { icon: Map, label: "Gear rental & ski school" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col overflow-hidden">
        {/* Background from skiutah.com — no color filter */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.skiutah.com/dist/images/home-hero.jpg"
          alt="Utah ski slopes"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Subtle top gradient only — lets the photo breathe */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

        {/* Title + subcopy — top, over the dark blue sky */}
        <motion.div
          className="relative z-10 pl-40 pr-20 pt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <h1 className="text-6xl sm:text-7xl font-black text-white leading-tight tracking-tight whitespace-nowrap">
            Plan your perfect Utah ski trip.
          </h1>
          <p className="text-xl text-white/80 mt-4 whitespace-nowrap font-medium">
            Flights, lodging, lift tickets, dining, and a full itinerary — built for your group in minutes.
          </p>
        </motion.div>

        {/* CTA — bottom left third */}
        <motion.div
          className="relative z-10 mt-auto pl-40 pr-20 pb-20"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/plan"
            className="inline-flex items-center gap-3 px-9 py-4 bg-white text-[#0D2240] rounded-2xl text-base font-bold hover:bg-[#F0F6FF] transition-colors shadow-lg"
          >
            Get Started Now
            <ArrowRight size={17} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <span className="text-xs font-semibold text-[#3D5066] uppercase tracking-widest">
              How it works
            </span>
            <h2 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mt-2">
              Your trip in 4 simple steps
            </h2>
            <p className="text-[#3D5066] mt-3 text-base max-w-md mx-auto">
              The only planner built for Utah skiing — with pass compatibility,
              snow forecasts, and multi-resort itineraries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-5 p-7 rounded-2xl border border-[#E8E8E8] bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#0D2240] flex items-center justify-center">
                  <step.icon size={20} strokeWidth={1.75} className="text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#BBBBBB] uppercase tracking-widest mb-1">
                    Step {step.number}
                  </div>
                  <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[#3D5066] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You'll Get ────────────────────────────────────────────────────── */}
      <section className="py-24 px-20 bg-[#F7F9FC]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold text-[#3D5066] uppercase tracking-widest">
                What's included
              </span>
              <h2 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mt-2 mb-4">
                Everything for
                <br />
                the perfect trip.
              </h2>
              <p className="text-[#3D5066] text-base leading-relaxed mb-8">
                Your final plan is a complete, ready-to-book package — not just
                resort suggestions. We handle every detail so you can focus on
                the mountain.
              </p>
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 text-[#0D2240] text-sm font-bold hover:text-[#1B6BB0] transition-colors"
              >
                Start building your trip
                <ChevronRight size={15} strokeWidth={2.5} />
              </Link>
            </motion.div>

            {/* Right checklist */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {INCLUDES.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#E8E8E8]"
                >
                  <CheckCircle2 size={16} strokeWidth={2} className="text-[#5BB8F5] flex-shrink-0" />
                  <span className="text-[13px] font-medium text-[#333333] leading-snug">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative py-28 px-20 overflow-hidden">
        {/* Reuse hero image as background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.skiutah.com/dist/images/home-hero.jpg"
          alt="Utah mountain skiing"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#0D2240]/82" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest mb-7">
              <Snowflake size={11} strokeWidth={2.5} />
              Free to use
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Ready to ski Utah?
            </h2>
            <p className="text-white/65 text-base mb-10 max-w-sm mx-auto leading-relaxed">
              Build your complete trip package — resort, hotel, flights, and
              itinerary — in about 5 minutes.
            </p>
            <Link
              href="/plan"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#0D2240] rounded-2xl text-base font-bold hover:bg-[#F0F6FF] transition-colors shadow-xl"
            >
              Get Started Now
              <ArrowRight size={17} strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
