// Gallery Section Configuration V1 added on 13-04-2026-Adib
// diisah biar update enak dan performa enak loadnya

export interface GalleryCardConfig {
  cardWidth: number;
  cardHeight: number;
  offsetX: number;
  offsetY: number;
  skew: number;
  expandScale: number;
  expandX: number;
  expandY: number;
  containerWidthOffset: number;
  containerHeightOffset: number;
}

// ============ DESKTOP CONFIG (1024px+) ============
export const DESKTOP_CONFIG: GalleryCardConfig = {
  cardWidth: 620,
  cardHeight: 520,
  offsetX: 30,
  offsetY: 30,
  skew: 2,
  expandScale: 1.2,
  expandX: -200,
  expandY: -50,
  containerWidthOffset: -2,
  containerHeightOffset: 2,
};

// ============ TABLET CONFIG (768px - 1023px) ============
export const TABLET_CONFIG: GalleryCardConfig = {
  cardWidth: 420,
  cardHeight: 380,
  offsetX: 25,
  offsetY: 25,
  skew: 2,
  expandScale: 1.15,
  expandX: -150,
  expandY: 30,
  containerWidthOffset: 0,
  containerHeightOffset: 9,
};

// ============ MOBILE CONFIG (<768px) ============
export const MOBILE_CONFIG: GalleryCardConfig = {
  cardWidth: 300,
  cardHeight: 280,
  offsetX: 30,
  offsetY: 45,
  skew: 2,
  expandScale: 1.15,
  expandX: 30,
  expandY: -120,
  containerWidthOffset: 2,
  containerHeightOffset: 2,
};

// Gallery card data
export const CARDS_DATA = [
  {
    text: "Kami mengurangi sampah dengan mengganti sedotan plastik dan tisu dengan sedotan stainless dan lap bersih",
    bg: "linear-gradient(145deg, #1a1612 0%, #2e231a 60%, #3a2d20 100%)",
    accent: "#c8a97e",
    label: "01",
    image: "/gallery/01.jpg",
  },
  {
    text: "Air putih gratis supaya pengunjung tidak perlu membeli air minum kemasan sekali pakai",
    bg: "linear-gradient(160deg, #111a17 0%, #1e2e28 55%, #253830 100%)",
    accent: "#7ec8a9",
    label: "02",
    image: "/gallery/02.jpg",
  },
  {
    text: "Bahkan jika masih ada sampah, kami ukur rutin untuk memantau produktifitas sampah dari cafe",
    bg: "linear-gradient(135deg, #0e1217 0%, #1a2130 60%, #1e2840 100%)",
    accent: "#7ea9c8",
    label: "03",
    image: "/gallery/03.jpg",
  },
];

// Color constants
export const GALLERY_COLORS = {
  BEIGE: "#f4f1ed",
  NAVY: "#06111e",
};

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
};

// Helper function to get config based on screen width
export function getGalleryConfig(width: number): GalleryCardConfig {
  if (width < BREAKPOINTS.MOBILE) {
    return MOBILE_CONFIG;
  } else if (width < BREAKPOINTS.TABLET) {
    return TABLET_CONFIG;
  }
  return DESKTOP_CONFIG;
}

// Helper function to get device type
export function getDeviceType(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < BREAKPOINTS.MOBILE) {
    return 'mobile';
  } else if (width < BREAKPOINTS.TABLET) {
    return 'tablet';
  }
  return 'desktop';
}
