"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Snowflake,
  Mountain,
  Map,
  MessageCircle,
  Star,
  ChevronRight,
  Plane,
  Hotel,
  Utensils,
} from "lucide-react";
import Nav from "@/components/layout/Nav";

const NAV_LINKS = [
  { label: "Resorts", href: "/resorts" },
  { label: "Lodging", href: "/lodging" },
  { label: "Activities", href: "/activities" },
  { label: "Dining", href: "/food" },
  { label: "Gear", href: "/gear" },
];

// ─── Featured resorts ──────────────────────────────────────────────────────────
const FEATURED = [
  {
    slug: "park-city",
    name: "Park City Mountain",
    tagline: "USA's largest ski resort",
    stats: "7,300 acres · 330 trails",
    image:
      "https://images.unsplash.com/photo-1510133768164-a3f037b3e78e?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "deer-valley",
    name: "Deer Valley Resort",
    tagline: "Refined mountain luxury",
    stats: "2,026 acres · 103 trails",
    image:
      "https://images.unsplash.com/photo-1612178537253-bccd437b730e?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "snowbird",
    name: "Snowbird",
    tagline: '500"+ average annual snowfall',
    stats: "2,500 acres · 169 trails",
    image:
      "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "alta",
    name: "Alta Ski Area",
    tagline: "Ski-only powder legend",
    stats: "2,614 acres · 116 trails",
    image:
      "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=800&q=80",
  },
];

// ─── How it works steps ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    icon: Map,
    step: "01",
    title: "Tell us about your trip",
    body: "Dates, budget, group size, skill levels, and which pass you hold. Takes about 2 minutes.",
  },
  {
    icon: Snowflake,
    step: "02",
    title: "We build your packages",
    body: "Our planner matches resorts, lodging, and flights to your group — ranked by value, snow likelihood, and terrain fit.",
  },
  {
    icon: Hotel,
    step: "03",
    title: "Customize your itinerary",
    body: "Pick your hotel and flights, then build a day-by-day plan with dining, activities, and gear.",
  },
  {
    icon: Plane,
    step: "04",
    title: "Book with confidence",
    body: "Everything confirmed in one place. Your AI concierge stays available throughout for any questions.",
  },
];

// ─── Trust stats ───────────────────────────────────────────────────────────────
const STATS = [
  { value: "15", label: "Utah ski resorts" },
  { value: '500"+', label: "Avg annual snowfall" },
  { value: "4", label: "Pass types supported" },
  { value: "5★", label: "Hiring manager rating" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=2000&q=80"
          alt="Utah ski slopes"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D2240]/70 via-[#0D2240]/50 to-[#0D2240]/80" />

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest mb-6">
              <Snowflake size={11} strokeWidth={2.5} />
              Utah's Greatest Snow on Earth
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-6">
              Plan your perfect
              <br />
              <span className="text-[#5BB8F5]">Utah ski trip.</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-xl">
              Flights, lodging, lift tickets, gear, dining, and a day-by-day
              itinerary — built for your group in under 5 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/plan"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-[#0D2240] rounded-xl text-base font-bold hover:bg-[#F7F7F7] transition-colors"
              >
                Start Planning
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href="/concierge"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                <MessageCircle size={14} strokeWidth={2} />
                Ask the Concierge
              </Link>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="mt-20 flex flex-wrap gap-x-10 gap-y-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{s.value}</span>
                <span className="text-sm text-white/60">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-white/40 text-xs uppercase tracking-widest">
            Explore
          </span>
          <motion.div
            className="w-0.5 h-8 bg-white/20 rounded-full overflow-hidden"
            animate={{}}
          >
            <motion.div
              className="w-full h-1/2 bg-white/60 rounded-full"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Featured Resorts ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F7F7F7]">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mountain size={14} className="text-[#717171]" />
                <span className="text-xs font-semibold text-[#717171] uppercase tracking-widest">
                  15 world-class resorts
                </span>
              </div>
              <h2 className="text-3xl font-bold text-[#222222] tracking-tight">
                Utah's greatest mountains
              </h2>
            </div>
            <Link
              href="/resorts"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#0D2240] hover:text-[#1B6BB0] transition-colors"
            >
              View all resorts
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Resort cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED.map((resort, i) => (
              <motion.div
                key={resort.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link
                  href={`/resorts/${resort.slug}`}
                  className="group block rounded-2xl overflow-hidden border border-[#DDDDDD] bg-white hover:shadow-md transition-shadow"
                >
                  <div className="relative h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resort.image}
                      alt={resort.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[13px] font-bold text-[#222222] leading-snug">
                      {resort.name}
                    </p>
                    <p className="text-[12px] text-[#717171] mt-0.5">
                      {resort.tagline}
                    </p>
                    <p className="text-[11px] text-[#AAAAAA] mt-1 font-medium">
                      {resort.stats}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Link
              href="/resorts"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D2240]"
            >
              View all 15 resorts
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-3">
              <Star size={14} className="text-[#717171]" />
              <span className="text-xs font-semibold text-[#717171] uppercase tracking-widest">
                How it works
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#222222] tracking-tight">
              Your perfect trip in 4 steps
            </h2>
            <p className="text-[#717171] mt-3 text-base max-w-lg mx-auto">
              The only planner built for Utah skiing — with pass compatibility,
              snow forecasts, and multi-resort itineraries built in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-4 p-6 rounded-2xl border border-[#DDDDDD] bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0D2240] flex items-center justify-center">
                  <step.icon size={18} strokeWidth={2} className="text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest mb-1">
                    Step {step.step}
                  </div>
                  <h3 className="text-[15px] font-bold text-[#222222] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[#717171] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Concierge CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0D2240]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#5BB8F5] animate-pulse" />
                <span className="text-xs font-semibold text-[#5BB8F5] uppercase tracking-widest">
                  AI Concierge · Always available
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
                Your personal ski trip expert
              </h2>
              <p className="text-white/65 text-base max-w-md leading-relaxed">
                Ask about resort conditions, pass blackout dates, family-friendly
                trails, après-ski recommendations, or anything else about skiing
                in Utah.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link
                href="/concierge"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-white text-[#0D2240] rounded-xl text-sm font-bold hover:bg-[#F7F7F7] transition-colors whitespace-nowrap"
              >
                <MessageCircle size={16} strokeWidth={2} />
                Chat with Concierge
              </Link>
              <Link
                href="/plan"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                Start Planning Instead
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </motion.div>

          {/* Example chat bubbles */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              "Is Alta good for beginners with kids?",
              "What's the best week in January for powder?",
              "Which pass covers the most Park City terrain?",
            ].map((q) => (
              <Link
                key={q}
                href={`/concierge?q=${encodeURIComponent(q)}`}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/8 border border-white/12 hover:bg-white/12 transition-colors group"
              >
                <MessageCircle
                  size={14}
                  strokeWidth={2}
                  className="text-[#5BB8F5] flex-shrink-0"
                />
                <span className="text-sm text-white/75 group-hover:text-white transition-colors leading-snug">
                  {q}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pass Types ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F7F7F7]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Snowflake size={14} className="text-[#717171]" />
              <span className="text-xs font-semibold text-[#717171] uppercase tracking-widest">
                Pass compatibility
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#222222] tracking-tight">
              All major passes supported
            </h2>
            <p className="text-[#717171] mt-3 max-w-md mx-auto text-base">
              Tell us which pass you hold and we'll only show you resorts where
              you're covered — no blackout date surprises.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                name: "Ikon Pass",
                resorts: "Alta · Brighton · Snowbird · Solitude",
                color: "#0D2240",
              },
              {
                name: "Epic Pass",
                resorts: "Park City · Woodward",
                color: "#0057A8",
              },
              {
                name: "Mountain Collective",
                resorts: "Alta · Snowbird",
                color: "#1B4332",
              },
              {
                name: "Indy Pass",
                resorts: "Powder Mountain · Beaver Mountain",
                color: "#7C3AED",
              },
            ].map((pass) => (
              <motion.div
                key={pass.name}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-5 rounded-2xl border border-[#DDDDDD] bg-white"
              >
                <div
                  className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center"
                  style={{ backgroundColor: pass.color }}
                >
                  <Snowflake size={14} strokeWidth={2} className="text-white" />
                </div>
                <p className="text-[13px] font-bold text-[#222222] mb-1">
                  {pass.name}
                </p>
                <p className="text-[11px] text-[#717171] leading-relaxed">
                  {pass.resorts}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-t border-[#EBEBEB]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-[#222222] tracking-tight mb-4">
              Ready to ski Utah?
            </h2>
            <p className="text-[#717171] text-base mb-8">
              Build your perfect package — resort, hotel, flights, and itinerary
              — in about 5 minutes.
            </p>
            <Link
              href="/plan"
              className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#0D2240] text-white rounded-xl text-base font-bold hover:bg-[#1B6BB0] transition-colors"
            >
              Start Planning
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#F7F7F7] border-t border-[#DDDDDD] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#0D2240] flex items-center justify-center">
              <Mountain size={12} strokeWidth={2.5} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[#222222]">Ski Utah Trip Planner</span>
          </div>
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-[#717171] hover:text-[#222222] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-[#AAAAAA]">
            © 2026 Ski Utah Trip Planner
          </p>
        </div>
      </footer>
    </div>
  );
}
