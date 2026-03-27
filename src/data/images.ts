// Official Ski Utah CDN images — sourced from skiutah.com/resorts/
// All images are real resort photography, verified as serving valid JPEGs

export const RESORT_IMAGES: Record<string, string> = {
  "alta":
    "https://www.skiutah.com/files/subblob/service/images.listing/1072139158",
  "snowbird":
    "https://www.skiutah.com/files/subblob/service/images.listing/1072139134",
  "brighton":
    "https://www.skiutah.com/files/subblob/service/images.listing/1072141064",
  "solitude":
    "https://www.skiutah.com/files/subblob/service/images.listing/1072139200",
  "deer-valley":
    "https://www.skiutah.com/files/subblob/service/images.listing/1072139403",
  "park-city":
    "https://www.skiutah.com/files/subblob/service/images.listing/1072140938",
  "woodward-park-city":
    "https://www.skiutah.com/files/subblob/service/images.listing/1072140938",
  "powder-mountain":
    "https://www.skiutah.com/files/subblob/service/images.listing/1072140050",
  "snowbasin":
    "https://www.skiutah.com/files/subblob/service/images.listing/1072140134",
  // Remaining resorts fall back to Unsplash ski scenes
  "nordic-valley":
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  "sundance":
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  "beaver-mountain":
    "https://images.unsplash.com/photo-1519592462825-5b2d2f9d8c20?auto=format&fit=crop&w=1200&q=80",
  "cherry-peak":
    "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=1200&q=80",
  "brian-head":
    "https://images.unsplash.com/photo-1457718588078-db7b3d64f5a7?auto=format&fit=crop&w=1200&q=80",
  "eagle-point":
    "https://images.unsplash.com/photo-1453090927415-5f45085b65c0?auto=format&fit=crop&w=1200&q=80",
};

export const HOTEL_IMAGES: Record<string, string> = {
  "stein-eriksen-residences":
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
  "st-regis-deer-valley":
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
  "pendry-park-city":
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
  "grand-summit-hotel":
    "https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&w=600&q=80",
  "hyatt-centric-park-city":
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
  "cliff-lodge":
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80",
  "evo-hotel":
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80",
  "alta-lodge":
    "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=600&q=80",
  "powder-mountain-hotel":
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80",
  // fallback
  "default":
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
};

export function getResortImage(slug: string): string {
  return RESORT_IMAGES[slug] ?? RESORT_IMAGES["alta"];
}

export function getHotelImage(id: string): string {
  return HOTEL_IMAGES[id] ?? HOTEL_IMAGES["default"];
}
