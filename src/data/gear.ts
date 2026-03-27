import { GearShop } from "@/types";

export const gearShops: GearShop[] = [
  {
    id: "white-pine-touring",
    name: "White Pine Touring",
    slug: "white-pine-touring",
    region: "Park City",
    services: ["Ski Rental", "Snowboard Rental", "Nordic Rental", "Repair", "Demo", "Retail"],
    brands: ["Atomic", "Salomon", "K2", "Rossignol", "Völkl"],
    priceRange: "$$",
    rating: 4.7,
    reviewCount: 543,
    description:
      "Park City's premier full-service ski and outdoor shop since 1976. Expert fitters, top demo equipment, and a passionate staff of avid skiers.",
    image: "/images/gear/white-pine.jpg",
    website: "https://www.whitepinetouring.com",
    phone: "(435) 649-8710",
    address: "1790 Bonanza Dr, Park City, UT 84060",
    rentalPackages: [
      { name: "Basic Ski Package", includes: ["Skis", "Boots", "Poles"], pricePerDay: 49 },
      { name: "Performance Ski Package", includes: ["High-performance skis", "Boots", "Poles"], pricePerDay: 79 },
      { name: "Demo Package", includes: ["Latest model skis", "Boots", "Poles"], pricePerDay: 99 },
      { name: "Snowboard Package", includes: ["Snowboard", "Boots", "Bindings"], pricePerDay: 59 },
    ],
  },
  {
    id: "ski-butlers-park-city",
    name: "Ski Butlers — Park City",
    slug: "ski-butlers-park-city",
    region: "Park City",
    services: ["Ski Rental Delivery", "Snowboard Rental Delivery", "Boot Fitting"],
    brands: ["Rossignol", "Atomic", "Burton", "Salomon"],
    priceRange: "$$$",
    rating: 4.9,
    reviewCount: 1204,
    description:
      "The premium ski rental delivery service that brings high-end equipment directly to your hotel or condo. Certified boot fitters ensure the perfect fit before you ever hit the slopes.",
    image: "/images/gear/ski-butlers.jpg",
    website: "https://www.skibutlers.com",
    phone: "(435) 200-8280",
    address: "Delivery to any Park City accommodation",
    rentalPackages: [
      { name: "Standard Delivery Package", includes: ["Skis", "Boots", "Poles", "Delivery & Pickup"], pricePerDay: 89 },
      { name: "Performance Delivery Package", includes: ["Performance skis", "Boots", "Poles", "Delivery & Pickup"], pricePerDay: 119 },
    ],
  },
  {
    id: "canyon-sports",
    name: "Canyon Sports",
    slug: "canyon-sports",
    region: "Salt Lake",
    services: ["Ski Rental", "Snowboard Rental", "Repair", "Retail", "Demo"],
    brands: ["Völkl", "Head", "Fischer", "Lib Tech", "Jones"],
    priceRange: "$$",
    rating: 4.5,
    reviewCount: 678,
    description:
      "Conveniently located in Salt Lake City with multiple locations near the Cottonwood Canyons. Great selection of rental equipment with knowledgeable staff.",
    image: "/images/gear/canyon-sports.jpg",
    website: "https://www.canyonsports.com",
    phone: "(801) 942-3100",
    address: "2065 E 7000 S, Salt Lake City, UT 84121",
    rentalPackages: [
      { name: "Basic Ski Package", includes: ["Skis", "Boots", "Poles"], pricePerDay: 44 },
      { name: "Performance Ski Package", includes: ["High-performance skis", "Boots", "Poles"], pricePerDay: 69 },
      { name: "Snowboard Package", includes: ["Snowboard", "Boots", "Bindings"], pricePerDay: 54 },
    ],
  },
  {
    id: "alta-ski-rentals",
    name: "Alta Ski Rentals",
    slug: "alta-ski-rentals",
    region: "Salt Lake",
    services: ["Ski Rental", "Boot Fitting", "Repair", "Demo"],
    brands: ["Atomic", "K2", "Salomon", "Dynastar"],
    priceRange: "$$",
    rating: 4.4,
    reviewCount: 392,
    description:
      "On-mountain rentals at the base of Alta Ski Area. Quick and convenient with expert staff who ski Alta every day and know the terrain perfectly.",
    image: "/images/gear/alta-rentals.jpg",
    website: "https://www.alta.com/rentals",
    phone: "(801) 742-3333",
    address: "Base of Alta Ski Area, Alta, UT 84092",
    rentalPackages: [
      { name: "Recreational Package", includes: ["Skis", "Boots", "Poles"], pricePerDay: 52 },
      { name: "Performance Package", includes: ["Powder skis", "Boots", "Poles"], pricePerDay: 82 },
    ],
  },
  {
    id: "gearheads-outdoor",
    name: "Gearheads Outdoor Store",
    slug: "gearheads-outdoor",
    region: "Salt Lake",
    services: ["Ski Rental", "Snowboard Rental", "Backcountry Gear", "Repair", "Retail"],
    brands: ["Black Diamond", "Dynafit", "Scott", "Marker", "Tecnica"],
    priceRange: "$$$",
    rating: 4.6,
    reviewCount: 287,
    description:
      "Salt Lake's go-to shop for serious skiers and backcountry adventurers. Deep inventory of technical gear, expert advice, and the best selection of touring equipment in the state.",
    image: "/images/gear/gearheads.jpg",
    website: "https://www.gearheadsoutdoor.com",
    phone: "(801) 467-9000",
    address: "1300 E 900 S, Salt Lake City, UT 84105",
    rentalPackages: [
      { name: "Backcountry Touring Package", includes: ["Touring skis", "Touring boots", "Bindings", "Poles", "Beacon", "Probe", "Shovel"], pricePerDay: 119 },
      { name: "Alpine Performance Package", includes: ["High-performance skis", "Race boots", "Poles"], pricePerDay: 89 },
    ],
  },
];

export function getGearShopsByRegion(region: string): GearShop[] {
  return gearShops.filter((g) => g.region === region);
}

export function getGearShopBySlug(slug: string): GearShop | undefined {
  return gearShops.find((g) => g.slug === slug);
}
