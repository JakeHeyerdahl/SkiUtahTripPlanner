// ─── Resorts ───────────────────────────────────────────────────────────────

export type Region =
  | "Salt Lake"
  | "Park City"
  | "Ogden Valley"
  | "Heber Valley"
  | "Northern Utah"
  | "Southern Utah";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Resort {
  id: string;
  name: string;
  slug: string;
  region: Region;
  location: string;
  established: number;
  verticalDrop: number; // feet
  skiableAcres: number;
  lifts: number;
  terrain: {
    green: number; // percentage
    blue: number;
    black: number;
  };
  annualSnowfall: number; // inches
  summit: number; // elevation in feet
  base: number; // elevation in feet
  description: string;
  highlights: string[];
  bestFor: SkillLevel[];
  image: string;
  website: string;
  phone?: string;
  address: string;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  passes: string[]; // e.g. ["Ikon Pass", "Mountain Collective"]
  liftTicketPrice: { adult: number; child: number; senior: number };
}

// ─── Lodging ────────────────────────────────────────────────────────────────

export type LodgingType = "hotel" | "condo" | "vacation-rental" | "resort";

export interface Lodging {
  id: string;
  name: string;
  slug: string;
  type: LodgingType;
  region: Region;
  resortProximity: string; // e.g. "Ski-in/Ski-out at Snowbird"
  rating: number; // 1-5
  reviewCount: number;
  pricePerNight: number; // USD
  description: string;
  amenities: string[];
  image: string;
  website?: string;
  phone?: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

// ─── Activities ──────────────────────────────────────────────────────────────

export type ActivityCategory =
  | "Adventure"
  | "Relaxation"
  | "Family"
  | "Culture"
  | "Nightlife";

export interface Activity {
  id: string;
  name: string;
  slug: string;
  category: ActivityCategory;
  region: Region;
  description: string;
  price: number; // per person
  duration: string; // e.g. "2 hours"
  difficulty?: SkillLevel;
  minAge?: number;
  image: string;
  website?: string;
  phone?: string;
  address: string;
}

// ─── Food & Drink ────────────────────────────────────────────────────────────

export type DiningCategory =
  | "Fine Dining"
  | "Casual"
  | "Après-Ski"
  | "Breakfast"
  | "Brewery"
  | "Cafe";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  category: DiningCategory;
  region: Region;
  cuisine: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  website?: string;
  phone?: string;
  address: string;
  hours?: string;
  reservationRequired?: boolean;
}

// ─── Gear Rentals ────────────────────────────────────────────────────────────

export interface GearShop {
  id: string;
  name: string;
  slug: string;
  region: Region;
  services: string[]; // e.g. ["Ski Rental", "Snowboard Rental", "Demo", "Repair"]
  brands: string[];
  priceRange: "$" | "$$" | "$$$";
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  website?: string;
  phone?: string;
  address: string;
  rentalPackages: RentalPackage[];
}

export interface RentalPackage {
  name: string; // e.g. "Basic Ski Package"
  includes: string[];
  pricePerDay: number;
}

// ─── Transportation ──────────────────────────────────────────────────────────

export type TransportType = "shuttle" | "bus" | "private" | "rideshare" | "car-rental";

export interface TransportOption {
  id: string;
  name: string;
  slug: string;
  type: TransportType;
  region: Region;
  routes: string[]; // e.g. ["SLC Airport → Park City", "Salt Lake → Snowbird"]
  priceFrom: number; // per person one-way
  description: string;
  image: string;
  website?: string;
  phone?: string;
}

// ─── Ski School ──────────────────────────────────────────────────────────────

export interface SkiSchool {
  id: string;
  name: string;
  slug: string;
  resort: string;
  region: Region;
  description: string;
  programs: SkiProgram[];
  image: string;
  website?: string;
  phone?: string;
}

export interface SkiProgram {
  name: string;
  skillLevel: SkillLevel[];
  ageGroup: "kids" | "adults" | "all";
  duration: string;
  pricePerPerson: number;
  maxGroupSize?: number;
  includes: string[];
}

// ─── Trip Planner ─────────────────────────────────────────────────────────────

export interface TripDetails {
  destination?: Region;
  resort?: string;
  startDate?: string;
  endDate?: string;
  guests: {
    adults: number;
    children: number;
  };
  skillLevel?: SkillLevel;
  budget?: "budget" | "moderate" | "luxury";
}

// ─── Chat / Concierge ─────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
