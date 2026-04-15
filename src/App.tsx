import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useLenisSetup, getLenis } from "@/lib/useLenis";
import Preloader from "@/components/Preloader";
import HeroSection from "@/components/HeroSection";

// Lazy load heavy components for better initial load performance
const CounterCommitmentSectionV2 = lazy(() => import("@/components/CounterCommitmentSectionV2"));
const LogoRetorikaSectionV2 = lazy(() => import("@/components/LogoRetorikaSectionV2"));
const GlobeMapSection = lazy(() => import("@/components/GlobeMapSection"));
const DatangPergiSection = lazy(() => import("@/components/DatangPergiSection"));
const GallerySection = lazy(() => import("@/components/GallerySection"));

// Minimal loading fallback
const SectionFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
  </div>
);

function SmartHeader() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const checkHeader = () => {
      const lightSections = document.querySelectorAll<HTMLElement>(".light-section");
      const anyLight = Array.from(lightSections).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < 80 && r.bottom > 80;
      });
      setDark(anyLight);
      ticking = false;
    };
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkHeader);
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    checkHeader();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textClass = dark ? "text-black" : "text-white";

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: false, duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-5 md:py-6 transition-colors duration-500 ${textClass}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <button
        onClick={scrollToTop}
        className="retrorika-font text-xs md:text-sm tracking-widest font-light opacity-90 hover:opacity-100 transition-opacity"
      >
        RETRORIKA
      </button>
      <button
        className="retrorika-font text-xs md:text-sm tracking-widest font-light opacity-75 hover:opacity-100 transition-opacity duration-300"
      >
        OUR MENU
      </button>
    </motion.header>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize Lenis smooth scrolling
  useLenisSetup();
  
  const handlePreloadComplete = useCallback(() => {
    setIsLoaded(true);
    // Enable scroll after preload
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    // Disable scroll during preload
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      {!isLoaded && <Preloader onComplete={handlePreloadComplete} />}
      
      <div className="relative" style={{ visibility: isLoaded ? "visible" : "hidden" }}>
        <SmartHeader />
        <HeroSection isLoaded={isLoaded} />
        <Suspense fallback={<SectionFallback />}>
          <CounterCommitmentSectionV2 />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <LogoRetorikaSectionV2 />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <GlobeMapSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <DatangPergiSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <GallerySection />
        </Suspense>
      </div>
    </>
  );
}
