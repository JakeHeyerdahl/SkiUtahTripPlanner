import { Activity } from "@/types";

export const activities: Activity[] = [
  // ─── Park City ──────────────────────────────────────────────────────────────
  {
    id: "utah-olympic-park",
    name: "Utah Olympic Park",
    slug: "utah-olympic-park",
    category: "Adventure",
    region: "Park City",
    description:
      "Tour the site of the 2002 Winter Olympics and ride a real bobsled down the Olympic track. Also features ski jumping, freestyle aerials, and the Alf Engen Ski Museum.",
    price: 75,
    duration: "Half day",
    image: "/images/activities/olympic-park.jpg",
    website: "https://www.utaholympiclegacy.org",
    phone: "(435) 658-4200",
    address: "3419 Olympic Pkwy, Park City, UT 84098",
  },
  {
    id: "park-city-snowmobile",
    name: "Park City Snowmobile Tours",
    slug: "park-city-snowmobile",
    category: "Adventure",
    region: "Park City",
    description:
      "Guided snowmobile tours through the pristine backcountry of the Wasatch Mountains. Beginners and experts welcome on trails with sweeping views.",
    price: 149,
    duration: "2-3 hours",
    image: "/images/activities/snowmobile.jpg",
    phone: "(435) 649-8001",
    address: "2600 Rasmussen Rd, Park City, UT 84098",
  },
  {
    id: "park-city-sleigh-rides",
    name: "Historic Park City Sleigh Rides",
    slug: "park-city-sleigh-rides",
    category: "Family",
    region: "Park City",
    description:
      "Horse-drawn sleigh rides through snow-covered meadows at the base of the Wasatch Mountains. Perfect for families with hot cocoa included.",
    price: 69,
    duration: "1 hour",
    minAge: 0,
    image: "/images/activities/sleigh-ride.jpg",
    phone: "(435) 649-7256",
    address: "Park City, UT 84060",
  },
  {
    id: "sundance-film-festival-screenings",
    name: "Sundance Film Festival",
    slug: "sundance-film-festival",
    category: "Culture",
    region: "Park City",
    description:
      "The world's premier independent film festival takes place in Park City every January. Watch world-premiere films, attend Q&As with directors, and soak in the electric atmosphere.",
    price: 25,
    duration: "2 hours per screening",
    image: "/images/activities/sundance-film.jpg",
    website: "https://www.sundance.org/festival",
    address: "Various venues, Park City, UT 84060",
  },
  {
    id: "deer-valley-spa",
    name: "Deer Valley Spa",
    slug: "deer-valley-spa",
    category: "Relaxation",
    region: "Park City",
    description:
      "Unwind after a day on the slopes at Deer Valley's world-class spa. Featuring mountain-inspired treatments, hot stone massages, and après-ski body wraps.",
    price: 180,
    duration: "90 minutes",
    image: "/images/activities/deer-valley-spa.jpg",
    website: "https://www.deervalley.com/spa",
    phone: "(435) 645-6601",
    address: "2250 Deer Valley Dr S, Park City, UT 84060",
  },

  // ─── Salt Lake ──────────────────────────────────────────────────────────────
  {
    id: "snowbird-tram-ride",
    name: "Snowbird Aerial Tram",
    slug: "snowbird-tram-ride",
    category: "Adventure",
    region: "Salt Lake",
    description:
      "Ride the iconic Snowbird tram to Hidden Peak at 11,000 feet for breathtaking 360-degree views of the Wasatch Range. Available to non-skiers too.",
    price: 39,
    duration: "1 hour round trip",
    image: "/images/activities/snowbird-tram.jpg",
    website: "https://www.snowbird.com/tram",
    phone: "(801) 933-2222",
    address: "9385 S Snowbird Center Dr, Snowbird, UT 84092",
  },
  {
    id: "cliff-spa-snowbird",
    name: "Cliff Spa at Snowbird",
    slug: "cliff-spa-snowbird",
    category: "Relaxation",
    region: "Salt Lake",
    description:
      "A full-service spa and fitness facility at The Cliff Lodge. Hot tubs, saunas, rooftop pool, and a full menu of massage and skincare treatments.",
    price: 160,
    duration: "60-90 minutes",
    image: "/images/activities/cliff-spa.jpg",
    website: "https://www.snowbird.com/cliff-spa",
    phone: "(801) 933-2225",
    address: "9385 S Snowbird Center Dr, Snowbird, UT 84092",
  },
  {
    id: "natural-history-museum-utah",
    name: "Natural History Museum of Utah",
    slug: "natural-history-museum",
    category: "Culture",
    region: "Salt Lake",
    description:
      "World-class dinosaur fossils, Native American artifacts, and stunning exhibits about Utah's ancient landscape. A great family activity on a rest day.",
    price: 24,
    duration: "2-3 hours",
    minAge: 0,
    image: "/images/activities/nhmu.jpg",
    website: "https://www.nhmu.utah.edu",
    phone: "(801) 581-6927",
    address: "301 Wakara Way, Salt Lake City, UT 84108",
  },

  // ─── Ogden Valley ───────────────────────────────────────────────────────────
  {
    id: "powder-mountain-cat-skiing",
    name: "Powder Mountain Cat Skiing",
    slug: "powder-mountain-cat-skiing",
    category: "Adventure",
    region: "Ogden Valley",
    description:
      "Access Powder Mountain's most remote and untracked powder stashes via snowcat. Small groups, big terrain, and unparalleled solitude.",
    price: 299,
    duration: "Full day",
    difficulty: "advanced",
    image: "/images/activities/cat-skiing.jpg",
    website: "https://www.powdermountain.com/cat-skiing",
    phone: "(801) 745-3772",
    address: "6965 E Powder Mountain Rd, Eden, UT 84310",
  },
  {
    id: "snowbasin-zip-line",
    name: "Snowbasin Zip Line & Gondola Tour",
    slug: "snowbasin-zip-line",
    category: "Adventure",
    region: "Ogden Valley",
    description:
      "Soar above the slopes on Snowbasin's zip line or take a scenic gondola tour with stunning views of the Ogden Valley and Great Salt Lake.",
    price: 89,
    duration: "2 hours",
    minAge: 7,
    image: "/images/activities/snowbasin-zip.jpg",
    website: "https://www.snowbasin.com/activities",
    phone: "(801) 620-1000",
    address: "3925 E Snowbasin Rd, Huntsville, UT 84317",
  },
];

export function getActivitiesByRegion(region: string): Activity[] {
  return activities.filter((a) => a.region === region);
}

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}
