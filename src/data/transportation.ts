import { TransportOption } from "@/types";

export const transportOptions: TransportOption[] = [
  {
    id: "canyon-transportation",
    name: "Canyon Transportation",
    slug: "canyon-transportation",
    type: "shuttle",
    region: "Salt Lake",
    routes: [
      "SLC Airport → Park City",
      "SLC Airport → Snowbird / Alta",
      "SLC Airport → Brighton / Solitude",
      "Park City → SLC Airport",
    ],
    priceFrom: 39,
    description:
      "Utah's premier shared-ride shuttle service with 24/7 airport transfers. Reliable, comfortable, and the most popular way to get from SLC airport to the ski resorts.",
    image: "/images/transport/canyon-transportation.jpg",
    website: "https://www.canyontransportation.com",
    phone: "(800) 255-1841",
  },
  {
    id: "park-city-transit",
    name: "Park City Free Transit",
    slug: "park-city-transit",
    type: "bus",
    region: "Park City",
    routes: [
      "Historic Main Street → Park City Mountain Base",
      "Deer Valley Loop",
      "Kimball Junction → Old Town",
      "Free Resort Connector",
    ],
    priceFrom: 0,
    description:
      "Park City's award-winning free bus system connects all major resort bases, Historic Main Street, and residential neighborhoods. No car needed in Park City.",
    image: "/images/transport/park-city-transit.jpg",
    website: "https://www.parkcity.org/transit",
    phone: "(435) 615-5000",
  },
  {
    id: "uta-ski-bus",
    name: "UTA Ski Bus",
    slug: "uta-ski-bus",
    type: "bus",
    region: "Salt Lake",
    routes: [
      "Salt Lake City TRAX → Little Cottonwood Canyon (Snowbird/Alta)",
      "Salt Lake City TRAX → Big Cottonwood Canyon (Brighton/Solitude)",
    ],
    priceFrom: 5,
    description:
      "Utah Transit Authority's ski bus runs daily from Salt Lake City light rail stations directly up the Cottonwood Canyons. Affordable, eco-friendly, and avoids canyon traffic.",
    image: "/images/transport/uta-ski-bus.jpg",
    website: "https://www.rideuta.com/ski-bus",
    phone: "(801) 743-3882",
  },
  {
    id: "alta-shuttle",
    name: "Alta/Snowbird Shuttle",
    slug: "alta-snowbird-shuttle",
    type: "shuttle",
    region: "Salt Lake",
    routes: [
      "SLC Airport → Snowbird",
      "SLC Airport → Alta",
      "Salt Lake City hotels → Cottonwood Canyons",
    ],
    priceFrom: 45,
    description:
      "Dedicated shuttle service to Little Cottonwood Canyon resorts. Private and shared options available with ski storage included.",
    image: "/images/transport/alta-shuttle.jpg",
    website: "https://www.altashuttleservice.com",
    phone: "(801) 274-0333",
  },
  {
    id: "executive-shuttle",
    name: "Executive Utah Shuttle",
    slug: "executive-shuttle",
    type: "private",
    region: "Park City",
    routes: [
      "SLC Airport → Any Park City Property",
      "SLC Airport → Any Salt Lake Resort",
      "Private charter — any destination",
    ],
    priceFrom: 149,
    description:
      "Premium private shuttle service in luxury SUVs and vans. Perfect for families with gear, groups, or those wanting a seamless door-to-door experience.",
    image: "/images/transport/executive-shuttle.jpg",
    website: "https://www.executiveutahshuttle.com",
    phone: "(435) 901-1234",
  },
  {
    id: "enterprise-slc",
    name: "Enterprise Rent-A-Car — SLC Airport",
    slug: "enterprise-slc",
    type: "car-rental",
    region: "Salt Lake",
    routes: ["SLC Airport pickup", "Drive anywhere in Utah"],
    priceFrom: 65,
    description:
      "Rent a car at SLC Airport for maximum flexibility. AWD and 4WD vehicles available — recommended for canyon driving. Book early during peak ski season.",
    image: "/images/transport/enterprise.jpg",
    website: "https://www.enterprise.com",
    phone: "(800) 261-7331",
  },
];

export function getTransportByRegion(region: string): TransportOption[] {
  return transportOptions.filter((t) => t.region === region);
}

export function getTransportBySlug(slug: string): TransportOption | undefined {
  return transportOptions.find((t) => t.slug === slug);
}
