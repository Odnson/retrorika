import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import WordReveal from "../src/components/WordReveal";

function useReplayCountUp(target: number, duration: number, isInView: boolean) {
  const [count, setCount] = useState(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(animFrameRef.current);

    if (!isInView) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };
    animFrameRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isInView, target, duration]);

  return count;
}

function formatNumber(n: number): string {
  return n.toLocaleString("id-ID");
}

export default function CounterCommitmentSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const isInView = useScroll({
    target: contentRef,
    offset: ["start center", "end center"],
  });

  const [shouldCount, setShouldCount] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = isInView.scrollYProgress.on("change", (v) => {
      setShouldCount(v > 0.1);
    });
    return unsubscribe;
  }, [isInView.scrollYProgress]);

  const count = useReplayCountUp(1456498, 1.5, shouldCount);

  // MOBILE ANIMATIONS (< 640px)
  // Phase 1: Counter text pushed up as crop comes from bottom - slower
  const contentYMobile = useTransform(scrollYProgress, [0.18, 0.30], ["0%", "-100%"]);
  const contentOpacityMobile = useTransform(scrollYProgress, [0.18, 0.28], [1, 0]);
  
  // Phase 2: PNG crop slides from bottom - slower
  const cropYMobile = useTransform(scrollYProgress, [0.18, 0.30], ["100%", "0%"]);
  const cropOpacityMobile = useTransform(scrollYProgress, [0.18, 0.25], [0, 1]);

  // DESKTOP/TABLET ANIMATIONS (>= 640px)
  // Phase 1: Counter text slides right as crop comes from left - slower
  const contentXDesktop = useTransform(scrollYProgress, [0.18, 0.30], ["0%", "100%"]);
  const contentOpacityDesktop = useTransform(scrollYProgress, [0.18, 0.28], [1, 0]);
  
  // Phase 2: PNG crop slides from left - slower
  const cropXDesktop = useTransform(scrollYProgress, [0.18, 0.30], ["-100%", "0%"]);
  const cropOpacityDesktop = useTransform(scrollYProgress, [0.18, 0.25], [0, 1]);

  // Phase 3: Background goes dark - slower
  const darkBgOpacity = useTransform(scrollYProgress, [0.28, 0.36], [0, 1]);

  // Phase 4: Background JPG reveals - slower
  const bgOpacity = useTransform(scrollYProgress, [0.36, 0.50], [0, 1]);
  const bgY = useTransform(scrollYProgress, [0.50, 1], ["0%", "-20%"]);

  // Crop PNG syncs with background
  const cropSyncY = useTransform(scrollYProgress, [0.50, 1], ["0%", "-20%"]);

  // Phase 5: Text "komitmen kami" appears - slower
  const textOpacity = useTransform(scrollYProgress, [0.50, 0.62], [0, 1]);

  // Phase 6: Commitment panel slides up - removed (handled by LogoRetrorikaSection overlap)

  return (
    <div ref={containerRef} style={{ height: "800vh", marginTop: "-121vh" }} className="relative z-10">
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ 
          height: "100dvh",
          // Mobile optimization
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
        }}
      >
        {/* Phase 1: White background with counter */}
        <section
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black light-section"
        >
          <motion.div 
            className="text-center px-8" 
            style={{ 
              marginTop: "1vh",
              x: isMobile ? 0 : contentXDesktop, // Desktop: slide right
              y: isMobile ? contentYMobile : 0, // Mobile: pushed up
              opacity: isMobile ? contentOpacityMobile : contentOpacityDesktop
            }}
          >
            <motion.p
              className="text-sm md:text-base tracking-widest text-gray-400 mb-2 font-light uppercase mt-1"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={shouldCount ? { opacity: 1, letterSpacing: "0.4em" } : { opacity: 0, letterSpacing: "0.1em" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Jumlah porsi yang disajikan
            </motion.p>

            <div
              className="text-5xl sm:text-7xl md:text-[10rem] font-extralight tracking-tight text-black leading-none mb-10 tabular-nums"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {formatNumber(count)}
            </div>

            <motion.p
              className="text-sm md:text-base tracking-widest text-gray-400 font-light"
              initial={{ opacity: 0 }}
              animate={shouldCount ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              Tapi, ini bukan soal angka
            </motion.p>
          </motion.div>
        </section>

        {/* Phase 3: Dark overlay behind PNG */}
        <motion.div
          className="absolute inset-0 z-[2] bg-black"
          style={{ opacity: darkBgOpacity }}
        />

        {/* Phase 4: Background JPG reveals and parallaxes */}
        <motion.div
          className="absolute inset-x-0 overflow-hidden z-[3]"
          style={{ 
            top: "-12%", 
            bottom: "-12%", 
            y: bgY,
            opacity: bgOpacity,
            // Mobile optimization
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
          }}
        >
          <img
            src="/nasi-campur.webp"
            alt="Nasi Campur"
            className="w-full h-full object-cover"
            style={{ 
              objectPosition: "center 30%",
              // GPU acceleration
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
            }}
          />
          <div className="absolute inset-0 bg-black/35" />
        </motion.div>

        {/* Phase 2 & sync: PNG crop - MOBILE (from bottom) */}
        <motion.div
          className="absolute z-[16] overflow-hidden sm:hidden"
          style={{ 
            y: cropYMobile, // From bottom to top
            opacity: cropOpacityMobile,
            top: "-12%",
            bottom: "-12%",
            left: 0,
            right: 0,
            // Mobile optimization
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
          }}
        >
          <motion.div
            className="w-full h-full"
            style={{ 
              y: cropSyncY, // Sync with background parallax
              // GPU acceleration
              WebkitTransform: "translateZ(0)",
              transform: "translateZ(0)",
            }}
          >
            <img
              src="/nasi-campur-crop.webp"
              alt="Nasi Campur Crop"
              className="w-full h-full"
              style={{ 
                objectFit: "contain",
                objectPosition: "center center",
                transform: "scale(5) translateZ(0)",
                WebkitTransform: "scale(5) translateZ(0)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Phase 2 & sync: PNG crop - TABLET (from left) */}
        <motion.div
          className="absolute z-[16] overflow-hidden hidden sm:block lg:hidden"
          style={{ 
            x: cropXDesktop, // From left to right
            y: cropSyncY,
            opacity: cropOpacityDesktop,
            top: "-12%",
            bottom: "-12%",
            left: 0,
            right: 0,
            // GPU acceleration
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
          }}
        >
          <img
            src="/nasi-campur-crop.webp"
            alt="Nasi Campur Crop"
            className="w-full h-full"
            style={{ 
              objectFit: "contain",
              objectPosition: "center center",
              transform: "scale(1.8) translateZ(0)",
              WebkitTransform: "scale(1.8) translateZ(0)",
            }}
          />
        </motion.div>

        {/* Phase 2 & sync: PNG crop - DESKTOP (from left) */}
        <motion.div
          className="absolute z-[16] overflow-hidden hidden lg:block"
          style={{ 
            x: cropXDesktop, // From left to right
            y: cropSyncY,
            opacity: cropOpacityDesktop,
            top: "-12%",
            bottom: "-12%",
            left: 0,
            right: 0,
            // GPU acceleration
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
          }}
        >
          <img
            src="/nasi-campur-crop.webp"
            alt="Nasi Campur Crop"
            className="w-full h-full"
            style={{ 
              objectFit: "contain",
              objectPosition: "center center",
              transform: "scale(1.2) translateZ(0)",
              WebkitTransform: "scale(1.2) translateZ(0)",
            }}
          />
        </motion.div>

        {/* Phase 5: Text "komitmen kami" appears - MOBILE */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-[15] pointer-events-none px-6 sm:hidden"
          style={{ opacity: textOpacity, marginTop: "-60vh" }}
        >
          <div className="text-center max-w-xs">
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white mb-1"
              delay={0}
              scrollProgress={scrollYProgress}
              startProgress={0.50}
              endProgress={0.68}
            >
              Ini adalah
            </WordReveal>
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white mb-1"
              delay={0.015}
              scrollProgress={scrollYProgress}
              startProgress={0.50}
              endProgress={0.68}
            >
              komitmen kami
            </WordReveal>
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white mb-1"
              delay={0.03}
              scrollProgress={scrollYProgress}
              startProgress={0.50}
              endProgress={0.68}
            >
              menyajikan resep
            </WordReveal>
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white mb-1"
              delay={0.08}
              scrollProgress={scrollYProgress}
              startProgress={0.50}
              endProgress={0.68}
            >
              terbaik sambil
            </WordReveal>
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white"
              delay={0.10}
              scrollProgress={scrollYProgress}
              startProgress={0.50}
              endProgress={0.68}
            >
              merawat ibu bumi
            </WordReveal>
          </div>
        </motion.div>

        {/* Phase 5: Text "komitmen kami" appears - DESKTOP */}
        <motion.div
          className="absolute inset-0 hidden sm:flex items-center justify-center z-[15] pointer-events-none px-6"
          style={{ opacity: textOpacity, marginTop: "-55vh" }}
        >
          <div className="text-center max-w-xl">
            <WordReveal
              className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed tracking-wide text-white mb-2"
              delay={0}
              scrollProgress={scrollYProgress}
              startProgress={0.50}
              endProgress={0.68}
            >
              Ini adalah komitmen kami
            </WordReveal>
            <WordReveal
              className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed tracking-wide text-white mb-2"
              delay={0.015}
              scrollProgress={scrollYProgress}
              startProgress={0.50}
              endProgress={0.68}
            >
              menyajikan resep terbaik
            </WordReveal>
            <WordReveal
              className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed tracking-wide text-white"
              delay={0.03}
              scrollProgress={scrollYProgress}
              startProgress={0.50}
              endProgress={0.68}
            >
              sambil merawat ibu bumi
            </WordReveal>
          </div>
        </motion.div>

        {/* Phase 6: Removed - LogoRetrorikaSection now overlaps with marginTop: -100vh */}
      </div>
    </div>
  );
}
