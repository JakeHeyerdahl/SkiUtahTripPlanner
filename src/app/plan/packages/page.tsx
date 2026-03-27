"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin, Mountain, Snowflake, Wind, Layers,
  Plane, Hotel, Star, Check, ChevronRight,
  Clock, ArrowRight, Users, Ticket,
} from "lucide-react";
import { TripProvider, useTripContext } from "@/context/TripContext";
import { generateTripPackages, calcPackageTotal, TripPackage } from "@/lib/generatePackages";
import { Lodging } from "@/types";
import { FlightOption } from "@/data/flights";
import { getResortImage, getHotelImage } from "@/data/images";
import { formatCurrency, cn } from "@/lib/utils";
import PassLogo from "@/components/ui/PassLogo";
import { PassType } from "@/context/TripContext";

// ─── Snow Badge ───────────────────────────────────────────────────────────────
function SnowBadge({ score, inches }: { score: number; inches: number }) {
  const isHigh = score >= 80;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0",
        isHigh ? "bg-[#EBF5FF] text-[#1B6BB0]" : "bg-[#F7F7F7] text-[#717171] border border-[#EBEBEB]"
      )}
    >
      <Snowflake size={11} strokeWidth={2.5} className="flex-shrink-0" />
      {score}% chance of {inches}&quot;+ snow
    </span>
  );
}

// ─── Terrain Bar ─────────────────────────────────────────────────────────────
function TerrainBar({ terrain }: { terrain: { green: number; blue: number; black: number } }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-1.5 rounded-full overflow-hidden flex-1 gap-px">
        <div className="bg-[#008A05]" style={{ width: `${terrain.green}%` }} />
        <div className="bg-[#1B6BB0]" style={{ width: `${terrain.blue}%` }} />
        <div className="bg-[#222222]" style={{ width: `${terrain.black}%` }} />
      </div>
      <div className="flex items-center gap-3 text-xs text-[#717171] whitespace-nowrap">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#008A05] inline-block flex-shrink-0" />
          {terrain.green}%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#1B6BB0] inline-block flex-shrink-0" />
          {terrain.blue}%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#222222] inline-block flex-shrink-0" />
          {terrain.black}%
        </span>
      </div>
    </div>
  );
}

// ─── Hotel Card ───────────────────────────────────────────────────────────────
function HotelCard({ hotel, selected, onClick }: { hotel: Lodging; selected: boolean; onClick: () => void }) {
  const imgSrc = getHotelImage(hotel.id);
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex-1 min-w-0 rounded-2xl border text-left transition-all duration-200 overflow-hidden bg-white",
        selected
          ? "border-[#222222] shadow-[0_0_0_1px_#222222]"
          : "border-[#DDDDDD] hover:border-[#AAAAAA] hover:shadow-sm"
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-[#222222] flex items-center justify-center shadow-sm">
          <Check size={12} strokeWidth={3} color="white" />
        </div>
      )}

      {/* Real hotel image */}
      <div className="relative h-32 overflow-hidden bg-[#F7F7F7]">
        <Image
          src={imgSrc}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="200px"
        />
        {/* Type badge over image */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-white/90 uppercase tracking-widest">
          {hotel.type}
        </span>
      </div>

      <div className="p-3">
        <p className="font-semibold text-[#222222] text-sm leading-snug mb-1 line-clamp-1">{hotel.name}</p>
        <div className="flex items-start gap-1 mb-2">
          <MapPin size={10} className="text-[#717171] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#717171] line-clamp-2 leading-tight">{hotel.resortProximity}</p>
        </div>
        <div className="flex items-center gap-1.5 mb-2">
          <Star size={10} className="fill-[#222222] text-[#222222] flex-shrink-0" />
          <span className="text-xs font-semibold text-[#222222]">{hotel.rating}</span>
          <span className="text-xs text-[#717171]">({hotel.reviewCount.toLocaleString()})</span>
        </div>
        <p className="text-sm font-bold text-[#222222]">
          {formatCurrency(hotel.pricePerNight)}
          <span className="font-normal text-[#717171] text-xs"> /&nbsp;night</span>
        </p>
      </div>
    </button>
  );
}

// ─── Flight Row ───────────────────────────────────────────────────────────────
function FlightRow({ flight, selected, onClick }: { flight: FlightOption; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 text-left",
        selected
          ? "border-[#222222] bg-[#FAFAFA] shadow-[0_0_0_1px_#222222]"
          : "border-[#DDDDDD] bg-white hover:border-[#AAAAAA] hover:shadow-sm"
      )}
    >
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{ backgroundColor: flight.logoColor + "18" }}
      >
        <Plane size={14} style={{ color: flight.logoColor }} strokeWidth={2} />
      </div>

      <div className="w-36 flex-shrink-0 min-w-0">
        <p className="text-sm font-semibold text-[#222222] leading-tight truncate">{flight.airline}</p>
        <p className="text-xs text-[#717171]">{flight.flightNumber}</p>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm font-semibold text-[#222222] whitespace-nowrap">{flight.departureTime}</span>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <div className="h-px flex-1 bg-[#DDDDDD]" />
          <span className="text-[10px] text-[#717171] whitespace-nowrap px-1">{flight.duration}</span>
          <div className="h-px flex-1 bg-[#DDDDDD]" />
        </div>
        <span className="text-sm font-semibold text-[#222222] whitespace-nowrap">{flight.arrivalTime} SLC</span>
      </div>

      <div className="w-16 text-center flex-shrink-0">
        <span className={cn("text-xs font-medium whitespace-nowrap", flight.stops === 0 ? "text-[#008A05]" : "text-[#717171]")}>
          {flight.stops === 0 ? "Nonstop" : "1 stop"}
        </span>
      </div>

      <div className="text-right flex-shrink-0 w-20">
        <p className="text-sm font-bold text-[#222222]">{formatCurrency(flight.pricePerPerson)}</p>
        <p className="text-[10px] text-[#717171]">per person</p>
      </div>

      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
        selected ? "bg-[#222222]" : "border border-[#DDDDDD]"
      )}>
        {selected && <Check size={10} strokeWidth={3} color="white" />}
      </div>
    </button>
  );
}

// ─── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[#717171]">{icon}</span>
      <span className="text-xs font-semibold text-[#717171] uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg, groupSize, index }: { pkg: TripPackage; groupSize: number; index: number }) {
  const router = useRouter();
  const [selectedHotelId, setSelectedHotelId] = useState(pkg.hotelOptions[0]?.id ?? "");
  const [selectedFlightId, setSelectedFlightId] = useState(pkg.flightOptions[0]?.id ?? "");

  const liveTotal = calcPackageTotal(
    { ...pkg, selectedHotelId, selectedFlightId },
    groupSize,
    pkg.nights
  );

  const LABEL_STYLES = [
    "bg-[#0D2240] text-white",
    "bg-[#F7F7F7] text-[#222222] border border-[#DDDDDD]",
    "bg-[#F7F7F7] text-[#222222] border border-[#DDDDDD]",
  ];

  const resortImg = getResortImage(pkg.resort.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white rounded-3xl border border-[#DDDDDD] overflow-hidden"
    >
      {/* ── Package label header ── */}
      <div className="px-6 pt-6 pb-5 border-b border-[#EBEBEB]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <span className={cn("inline-block text-xs font-bold px-3 py-1 rounded-full mb-3", LABEL_STYLES[index])}>
              {pkg.label}
            </span>
            <h2 className="text-2xl font-bold text-[#222222] leading-tight">{pkg.tagline}</h2>
            <p className="text-sm text-[#717171] mt-1 leading-snug">{pkg.marketingPoint}</p>
          </div>
          {/* Snow badge — flex-shrink-0 prevents wrap */}
          <SnowBadge score={pkg.snowLikelihood.score} inches={pkg.snowLikelihood.typicalInches} />
        </div>
      </div>

      {/* ── Row 1: Resort ── */}
      <div className="border-b border-[#EBEBEB]">
        {/* Action shot image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={resortImg}
            alt={pkg.resort.name}
            fill
            className="object-cover"
            sizes="896px"
            priority={index === 0}
          />
          {/* Gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Resort name over image */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} className="text-white/70 flex-shrink-0" />
                  <span className="text-white/70 text-xs font-medium">{pkg.resort.location} · {pkg.resort.region}</span>
                </div>
                <h3 className="text-3xl font-bold text-white leading-tight">{pkg.resort.name}</h3>
              </div>
              {/* Pass logo badge over image */}
              <div className="flex-shrink-0 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 border border-white/20">
                <Ticket size={12} className="text-white/80" />
                <PassLogo passType={pkg.liftTicketInfo.passName as PassType} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Resort stats below image */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-4 gap-0 divide-x divide-[#EBEBEB] mb-4">
            {[
              { icon: <ArrowRight size={13} />, value: `${pkg.resort.verticalDrop.toLocaleString()} ft`, label: "Vertical" },
              { icon: <Layers size={13} />, value: pkg.resort.skiableAcres.toLocaleString(), label: "Skiable Acres" },
              { icon: <Wind size={13} />, value: `${pkg.resort.annualSnowfall}"`, label: "Annual Snow" },
              { icon: <Users size={13} />, value: `${pkg.resort.lifts}`, label: "Lifts" },
            ].map((stat) => (
              <div key={stat.label} className="px-4 first:pl-0 last:pr-0">
                <div className="flex items-center gap-1 mb-0.5 text-[#717171]">{stat.icon}</div>
                <p className="text-base font-bold text-[#222222]">{stat.value}</p>
                <p className="text-xs text-[#717171]">{stat.label}</p>
              </div>
            ))}
          </div>
          <TerrainBar terrain={pkg.resort.terrain} />
        </div>
      </div>

      {/* ── Row 2: Hotels ── */}
      <div className="px-6 py-6 border-b border-[#EBEBEB]">
        <SectionLabel icon={<Hotel size={14} />} label="Where you'll stay — select one" />
        <div className="grid grid-cols-3 gap-3">
          {pkg.hotelOptions.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              selected={hotel.id === selectedHotelId}
              onClick={() => setSelectedHotelId(hotel.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Row 3: Flights ── */}
      <div className="px-6 py-6 border-b border-[#EBEBEB]">
        <SectionLabel icon={<Plane size={14} />} label="How you'll get there — select one" />
        <div className="space-y-2">
          {pkg.flightOptions.map((flight) => (
            <FlightRow
              key={flight.id}
              flight={flight}
              selected={flight.id === selectedFlightId}
              onClick={() => setSelectedFlightId(flight.id)}
            />
          ))}
        </div>
        <p className="text-xs text-[#717171] mt-3 flex items-center gap-1.5">
          <Clock size={11} className="flex-shrink-0" />
          Round-trip prices shown · calculated per person
        </p>
      </div>

      {/* ── Row 4: Total + CTA ── */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs text-[#717171] mb-1 font-medium uppercase tracking-wider">Estimated total</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <motion.span
                key={liveTotal}
                initial={{ opacity: 0.5, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-3xl font-bold text-[#222222]"
              >
                {formatCurrency(liveTotal)}
              </motion.span>
              <span className="text-sm text-[#717171]">· {pkg.nights} nights · group of {groupSize}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {[`Hotel (${pkg.nights} nights)`, "Flights (round-trip)", "Pass covered"].map((item) => (
                <span key={item} className="flex items-center gap-1 text-xs text-[#717171] whitespace-nowrap">
                  <Check size={10} className="text-[#008A05] flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push("/itinerary")}
            className="flex items-center gap-2 bg-[#0D2240] hover:bg-[#1B6BB0] text-white font-semibold text-sm px-6 py-4 rounded-xl transition-colors duration-200 whitespace-nowrap active:scale-[0.98] flex-shrink-0"
          >
            Build itinerary from this package
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Demo data fallback ───────────────────────────────────────────────────────
const DEMO_TRIP = {
  dates: [new Date(2026, 0, 15)],
  isAnytime: false,
  departureCity: "Los Angeles",
  budgetMin: 3000,
  budgetMax: 8000,
  groupMembers: [
    { id: "1", skillLevel: "intermediate" as const, isSkiing: true, needsRental: false },
    { id: "2", skillLevel: "beginner" as const, isSkiing: true, needsRental: true },
    { id: "3", skillLevel: "advanced" as const, isSkiing: true, needsRental: false },
    { id: "4", skillLevel: "beginner" as const, isSkiing: false, needsRental: false },
  ],
  passType: "ikon" as const,
  diningStyles: ["casual" as const, "apres-ski" as const],
  cuisinePreferences: ["american" as const],
  selectedPackage: null,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
function PackagesContent() {
  const { tripData } = useTripContext();
  const data = tripData.passType ? tripData : DEMO_TRIP;
  const packages = generateTripPackages(data);
  const groupSize = data.groupMembers.length;

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="bg-white border-b border-[#EBEBEB]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-[#1B6BB0] uppercase tracking-widest mb-2">
              Your personalized packages
            </p>
            <h1 className="text-3xl font-bold text-[#222222] mb-1">3 ways to ski Utah</h1>
            <p className="text-[#717171] text-sm">
              Select your preferred hotel and flight — your total updates in real time.
              {data.departureCity && ` Flights from ${data.departureCity}.`}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {packages.map((pkg, i) => (
          <PackageCard key={pkg.id} pkg={pkg} groupSize={groupSize} index={i} />
        ))}
      </div>

      {/* Floating concierge */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 24 }}
          onClick={() => window.location.href = "/concierge"}
          className="flex items-center gap-2.5 bg-[#0D2240] hover:bg-[#1B6BB0] text-white pl-4 pr-5 py-3 rounded-full shadow-lg font-semibold text-sm transition-colors duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 2C1 1.45 1.45 1 2 1H10C10.55 1 11 1.45 11 2V8C11 8.55 10.55 9 10 9H7L4 11V9H2C1.45 9 1 8.55 1 8V2Z" fill="white" />
            </svg>
          </div>
          Ask the concierge
        </motion.button>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <TripProvider>
      <PackagesContent />
    </TripProvider>
  );
}
