"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MessageCircle, Mountain, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Resorts", href: "/resorts" },
  { label: "Lodging", href: "/lodging" },
  { label: "Activities", href: "/activities" },
  { label: "Dining", href: "/food" },
  { label: "Gear", href: "/gear" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isTransparent =
    pathname === "/" && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-[#DDDDDD]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isTransparent ? "bg-white/20" : "bg-[#0D2240]"
            }`}
          >
            <Mountain
              size={16}
              strokeWidth={2.5}
              className={isTransparent ? "text-white" : "text-white"}
            />
          </div>
          <span
            className={`font-bold text-[15px] tracking-tight transition-colors ${
              isTransparent ? "text-white" : "text-[#222222]"
            }`}
          >
            Ski Utah
          </span>
          <span
            className={`text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border transition-colors hidden sm:inline ${
              isTransparent
                ? "text-white/70 border-white/30"
                : "text-[#3D5066] border-[#DDDDDD]"
            }`}
          >
            Trip Planner
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isTransparent
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : pathname === link.href
                  ? "text-[#0D2240] bg-[#F7F7F7]"
                  : "text-[#3D5066] hover:text-[#222222] hover:bg-[#F7F7F7]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/concierge"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              isTransparent
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7]"
            }`}
          >
            <MessageCircle size={14} strokeWidth={2} />
            Concierge
          </Link>
          <Link
            href="/plan"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#0D2240] text-white hover:bg-[#1B6BB0] transition-colors"
          >
            Plan My Trip
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X
              size={20}
              className={isTransparent ? "text-white" : "text-[#222222]"}
            />
          ) : (
            <Menu
              size={20}
              className={isTransparent ? "text-white" : "text-[#222222]"}
            />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#DDDDDD] px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-3 rounded-xl text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-[#EBEBEB] mt-2 pt-3 flex flex-col gap-2">
            <Link
              href="/concierge"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] transition-colors"
            >
              <MessageCircle size={14} strokeWidth={2} />
              Talk to Concierge
            </Link>
            <Link
              href="/plan"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#0D2240] text-white hover:bg-[#1B6BB0] transition-colors"
            >
              Plan My Trip
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
