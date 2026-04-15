import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export function useLenisSetup() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Add lenis class to html
    document.documentElement.classList.add("lenis", "lenis-smooth");
    
    // Detect if mobile/tablet for optimized settings
    const isMobile = window.innerWidth < 1024;
    
    // Create Lenis instance for smooth scrolling
    const lenis = new Lenis({
      // Faster duration on mobile for responsive feel
      duration: isMobile ? 0.8 : 1.2,
      // Smooth easing curve
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      // Smooth wheel for desktop
      smoothWheel: true,
      // Higher multiplier on mobile for responsive scroll
      wheelMultiplier: isMobile ? 1.0 : 1.0,
      touchMultiplier: isMobile ? 1.8 : 2.0,
      infinite: false,
      // Smoother touch on mobile
      syncTouch: true,
      syncTouchLerp: isMobile ? 0.08 : 0.075,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    
    // Handle resize to update Lenis
    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return lenisRef;
}

export function useScrollProgress(
  containerRef: React.RefObject<HTMLElement>,
  callback: (progress: number) => void
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        callback(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [containerRef, callback]);
}
