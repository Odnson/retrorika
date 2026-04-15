import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Scattered positions for PHASE 1 - DESKTOP (offset from canvas center, in px)
const SCATTER_DESKTOP = {
  r1: { x: -300, y: -170, scale: 0.60, rotate: 0 },   // mountains → top-left
  r2: { x: -290, y: 160, scale: 0.60, rotate: -3 },   // forest → left
  r3: { x: 280, y: -160, scale: 0.60, rotate: -6 },   // bird → top-right
  r4: { x: 255, y: 130, scale: 0.60, rotate: 0 },     // coffee → right
  r5: { x: -10, y: 270, scale: 0.60, rotate: 0 },     // wordmark → bottom-center
};

// Scattered positions for PHASE 1 - MOBILE (normalized to 480px canvas, scaled responsively)
const SCATTER_MOBILE_BASE = {
  r1: { x: -175, y: -150, scale: 0.60, rotate: 0 },   // mountains → top-left
  r2: { x: -170, y: 180, scale: 0.60, rotate: -3 },   // forest → left
  r3: { x: 180, y: -150, scale: 0.60, rotate: -6 },   // bird → top-right
  r4: { x: 165, y: 120, scale: 0.60, rotate: 0 },     // coffee → right
  r5: { x: 0, y: 350, scale: 0.60, rotate: 0 },       // wordmark → bottom-center
};

export default function LogoRetorikaSectionV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  
  // Refs for logo pieces
  const r1 = useRef<HTMLDivElement>(null); // mountains
  const r2 = useRef<HTMLDivElement>(null); // forest
  const r3 = useRef<HTMLDivElement>(null); // bird
  const r4 = useRef<HTMLDivElement>(null); // coffee tree
  const r5 = useRef<HTMLDivElement>(null); // wordmark
  const r6 = useRef<HTMLDivElement>(null); // frame/hexagon
  const r7 = useRef<HTMLDivElement>(null); // tagline
  
  // Refs for text labels
  const t1 = useRef<HTMLDivElement>(null); // mountain text
  const t2 = useRef<HTMLDivElement>(null); // forest text
  const t3 = useRef<HTMLDivElement>(null); // sparrow text
  const t4 = useRef<HTMLDivElement>(null); // tree text
  const t5 = useRef<HTMLDivElement>(null); // retrorika text
  
  // Refs for text reveal phase
  const textLine1Ref = useRef<HTMLParagraphElement>(null);
  const textLine2Ref = useRef<HTMLParagraphElement>(null);
  const textLine3Ref = useRef<HTMLParagraphElement>(null);
  const textLine4Ref = useRef<HTMLParagraphElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [sectionOpacity, setSectionOpacity] = useState(0);
  const [leavesYOffset, setLeavesYOffset] = useState(-200);

  // Detect mobile/tablet
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice, { passive: true });
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // GSAP logo assembly animation
  useEffect(() => {
    const all = [r1, r2, r3, r4, r5, r6, r7, t1, t2, t3, t4, t5];
    if (!containerRef.current || all.some((r) => !r.current)) return;

    let gsapCtx: ReturnType<typeof gsap.context> | null = null;

    function buildTimeline() {
      gsapCtx?.revert();

      // Determine if mobile and calculate scatter positions
      const isMobileDevice = window.innerWidth < 768;
      let SCATTER: typeof SCATTER_DESKTOP;

      if (isMobileDevice) {
        // For mobile: scale positions to actual canvas size
        const canvasEl = r1.current!.parentElement!;
        const canvasSize = canvasEl.getBoundingClientRect().width || 480;
        const f = Math.min(canvasSize / 480, 1);

        SCATTER = {
          r1: { ...SCATTER_MOBILE_BASE.r1, x: SCATTER_MOBILE_BASE.r1.x * f, y: SCATTER_MOBILE_BASE.r1.y * f },
          r2: { ...SCATTER_MOBILE_BASE.r2, x: SCATTER_MOBILE_BASE.r2.x * f, y: SCATTER_MOBILE_BASE.r2.y * f },
          r3: { ...SCATTER_MOBILE_BASE.r3, x: SCATTER_MOBILE_BASE.r3.x * f, y: SCATTER_MOBILE_BASE.r3.y * f },
          r4: { ...SCATTER_MOBILE_BASE.r4, x: SCATTER_MOBILE_BASE.r4.x * f, y: SCATTER_MOBILE_BASE.r4.y * f },
          r5: { ...SCATTER_MOBILE_BASE.r5, x: SCATTER_MOBILE_BASE.r5.x * f, y: SCATTER_MOBILE_BASE.r5.y * f },
        };
      } else {
        // For desktop: use fixed positions
        SCATTER = SCATTER_DESKTOP;
      }

      // Calculate movement offsets for intro animations (scaled for mobile)
      const moveScale = isMobileDevice ? 0.7 : 1;
      
      // Text offset positions (responsive based on device)
      const textOffset = isMobileDevice ? 10 : 30;

      gsapCtx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.4,
            onUpdate: (self) => {
              const progress = self.progress;
              
              // Fade in section (0 to 0.08)
              const fadeProgress = Math.min(progress / 0.08, 1);
              setSectionOpacity(fadeProgress);
              
              // Continue moving leaves up (0 to ~0.44)
              if (progress < 0.44) {
                const leavesProgress = progress / 0.44;
                setLeavesYOffset(-200 - leavesProgress * 200);
              } else {
                setLeavesYOffset(-400);
              }
            },
          },
        });

        // ══════════════════════════════════════════════
        //  PHASE 1 — INTRO: pieces appear one by one
        //  scattered around the canvas (0 → 5.1 units)
        // ══════════════════════════════════════════════

        // logo-1: mountains — enters from top-left corner
        tl.fromTo(r1.current,
          { x: SCATTER.r1.x - 120 * moveScale, y: SCATTER.r1.y - 100 * moveScale, scale: 0.38, opacity: 0, rotate: SCATTER.r1.rotate + 6 },
          { x: SCATTER.r1.x, y: SCATTER.r1.y, scale: SCATTER.r1.scale, opacity: 1, rotate: SCATTER.r1.rotate, duration: 1.1, ease: "power3.out" },
          0
        );
        // text label for mountains
        tl.fromTo(t1.current,
          { x: SCATTER.r1.x - 120 * moveScale, y: SCATTER.r1.y - 100 * moveScale + textOffset, opacity: 0 },
          { x: SCATTER.r1.x, y: SCATTER.r1.y + textOffset, opacity: 1, duration: 1.1, ease: "power3.out" },
          0
        );

        // logo-2: forest — rises from bottom-left
        tl.fromTo(r2.current,
          { x: SCATTER.r2.x - 100 * moveScale, y: SCATTER.r2.y + 120 * moveScale, scale: 0.38, opacity: 0, rotate: SCATTER.r2.rotate - 5 },
          { x: SCATTER.r2.x, y: SCATTER.r2.y - 80, scale: SCATTER.r2.scale, opacity: 1, rotate: SCATTER.r2.rotate, duration: 1.1, ease: "power3.out" },
          0.80
        );
        // text label for forest
        tl.fromTo(t2.current,
          { x: SCATTER.r2.x - 100 * moveScale, y: SCATTER.r2.y + 120 * moveScale + textOffset, opacity: 0 },
          { x: SCATTER.r2.x, y: SCATTER.r2.y + textOffset, opacity: 1, duration: 1.1, ease: "power3.out" },
          0.80
        );

        // logo-3: bird — flies in from far right
        tl.fromTo(r3.current,
          { x: SCATTER.r3.x + 200 * moveScale, y: SCATTER.r3.y - 80 * moveScale, scale: 0.35, opacity: 0, rotate: SCATTER.r3.rotate - 10 },
          { x: SCATTER.r3.x + 5, y: SCATTER.r3.y, scale: SCATTER.r3.scale, opacity: 1, rotate: SCATTER.r3.rotate, duration: 1.1, ease: "power3.out" },
          1.60
        );
        // text label for sparrow (centered)
        tl.fromTo(t3.current,
          { x: SCATTER.r3.x + 200 * moveScale, y: SCATTER.r3.y - 80 * moveScale + textOffset, opacity: 0 },
          { x: SCATTER.r3.x - 20, y: SCATTER.r3.y + textOffset, opacity: 1, duration: 1.1, ease: "power3.out" },
          1.60
        );

        // logo-4: coffee tree — comes from bottom-right
        tl.fromTo(r4.current,
          { x: SCATTER.r4.x + 120 * moveScale, y: SCATTER.r4.y + 120 * moveScale, scale: 0.38, opacity: 0, rotate: SCATTER.r4.rotate + 8 },
          { x: SCATTER.r4.x - 5, y: SCATTER.r4.y, scale: SCATTER.r4.scale, opacity: 1, rotate: SCATTER.r4.rotate, duration: 1.1, ease: "power3.out" },
          2.40
        );
        // text label for tree
        tl.fromTo(t4.current,
          { x: SCATTER.r4.x + 120 * moveScale, y: SCATTER.r4.y + 120 * moveScale + textOffset, opacity: 0 },
          { x: SCATTER.r4.x - 12, y: SCATTER.r4.y + 50, opacity: 1, duration: 1.1, ease: "power3.out" },
          2.40
        );

        // logo-5: wordmark — rises from bottom
        tl.fromTo(r5.current,
          { x: SCATTER.r5.x, y: SCATTER.r5.y + 110 * moveScale, scale: 0.38, opacity: 0, rotate: 0 },
          { x: SCATTER.r5.x, y: SCATTER.r5.y, scale: SCATTER.r5.scale, opacity: 1, rotate: 0, duration: 1.1, ease: "power3.out" },
          3.20
        );
        // text label for retrorika
        // tl.fromTo(t5.current,
        //   { x: SCATTER.r5.x, y: SCATTER.r5.y + 110 * moveScale + textOffset, opacity: 0 },
        //   { x: SCATTER.r5.x, y: SCATTER.r5.y + textOffset, opacity: 1, duration: 1.1, ease: "power3.out" },
        //   3.20
        // );

        // — hold all pieces scattered (brief pause) —
        tl.to({}, { duration: 0.8 }, 4.30);

        // ══════════════════════════════════════════════
        //  PHASE 2 — ASSEMBLE: pieces fly to center
        //  each one "connecting" to form the full logo
        //  (5.10 → 11.80 units)
        // ══════════════════════════════════════════════

        const ASSEMBLED = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };

        // ① Bird — first to arrive, with natural bounce
        tl.to(r3.current, { ...ASSEMBLED, duration: 1.5, ease: "back.out(1.6)" }, 5.10);
        tl.to(t3.current, { opacity: 0, duration: 0.6, ease: "power2.out" }, 5.10);

        // ② Coffee tree — sweeps up to meet the bird
        tl.to(r4.current, { ...ASSEMBLED, duration: 1.4, ease: "power3.out" }, 5.80);
        tl.to(t4.current, { opacity: 0, duration: 0.6, ease: "power2.out" }, 5.80);

        // ③ Forest — rises from below, locks in
        tl.to(r2.current, { ...ASSEMBLED, duration: 1.35, ease: "power2.out" }, 6.55);
        tl.to(t2.current, { opacity: 0, duration: 0.6, ease: "power2.out" }, 6.55);

        // ④ Mountains — sweeps up
        tl.to(r1.current, { ...ASSEMBLED, duration: 1.4, ease: "power3.out" }, 7.30);
        tl.to(t1.current, { opacity: 0, duration: 0.6, ease: "power2.out" }, 7.30);

        // ⑤ Logo-7 (tagline) — arrives simultaneously with mountains
        tl.fromTo(r7.current,
          { x: 0, y: 60, scale: 0.88, opacity: 0, filter: "contrast(0.08) brightness(3.5)" },
          { x: 0, y: 0, scale: 1, opacity: 1, filter: "contrast(1) brightness(1)", duration: 1.5, ease: "power2.out" },
          7.30
        );

        // ⑥ Wordmark — snaps in with bounce
        tl.to(r5.current, { ...ASSEMBLED, duration: 1.2, ease: "back.out(2.0)" }, 8.70);
        tl.to(t5.current, { opacity: 0, duration: 0.6, ease: "power2.out" }, 8.70);

        // ⑦ Logo-6 (hexagon frame) — LAST, wraps from oversized → exact fit
        tl.fromTo(r6.current,
          { scale: 1.85, opacity: 0, filter: "contrast(0.05) brightness(5)" },
          { scale: 1, opacity: 1, filter: "contrast(1) brightness(1)", duration: 2.2, ease: "expo.out" },
          9.60
        );

        // — hold assembled logo —
        tl.to({}, { duration: 0.8 }, 11.80);

        // ══════════════════════════════════════════════
        //  PHASE 3 — TEXT REVEAL: tagline appears with stagger
        //  (11.80 → 15.80 units)
        // ══════════════════════════════════════════════

        const textRevealDuration = 0.6;
        const textStagger = 0.15;

        // Move logo up and scale down when text reveal starts
        const logoCanvas = r1.current?.parentElement;
        if (logoCanvas) {
          tl.to(logoCanvas,
            { y: isMobileDevice ? -80 : -80, scale: isMobileDevice ? 0.65 : 0.7, duration: 1.2, ease: "power2.out" },
            12.60
          );
        }

        // Line 1: "Retrorika adalah satu-satunya"
        tl.fromTo(textLine1Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: textRevealDuration, ease: "power2.out" },
          12.60
        );

        // Line 2: "resto yang menerapkan prinsip"
        tl.fromTo(textLine2Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: textRevealDuration, ease: "power2.out" },
          12.60 + textStagger
        );

        // Line 3: "less waste · low carbon"
        tl.fromTo(textLine3Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: textRevealDuration, ease: "power2.out" },
          12.60 + textStagger * 2
        );

        // Line 4: "di Indonesia"
        tl.fromTo(textLine4Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: textRevealDuration, ease: "power2.out" },
          12.60 + textStagger * 3
        );

      }, containerRef);
    }

    // rAF ensures DOM is fully laid out before measuring canvas size
    const rafId = requestAnimationFrame(buildTimeline);

    // Rebuild on resize so mobile/desktop switch recalculates scatter positions
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildTimeline, 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      gsapCtx?.revert();
    };
  }, []);

  // Base layer style
  const base: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    willChange: "transform, opacity, filter",
  };

  return (
    <div 
      ref={containerRef} 
      style={{ height: "450vh", marginTop: "-150vh" }} 
      className="relative"
    >
      {/* Continue leaves movement from CounterCommitment */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 100, display: isMobile ? 'none' : 'block' }}>
        <div
          className="absolute overflow-visible"
          style={{ 
            top: `${leavesYOffset}%`,
            left: "0",
            right: "0",
            height: "100vh",
            WebkitTransform: "translateZ(0)",
          }}
        >
          <img
            src="/crop2.webp"
            alt="Leaves"
            className="w-full h-auto object-cover"
            style={{ 
              objectPosition: "center center",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
            }}
          />
        </div>
      </div>

      <div 
        ref={stickyRef}
        className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-[#f9f7f4] light-section"
        style={{ 
          opacity: sectionOpacity,
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
          zIndex: 30,
        }}
      >
        {/* Warm center glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 52%, rgba(255,246,228,0.55) 0%, transparent 72%)",
          }}
        />

        {/* Logo canvas - Z-index order: r6 (frame) → r7 (tagline) → r1 (mountains) → r2 (forest) → r5 (wordmark) → r4 (coffee) → r3 (bird) */}
        <div
          className="relative select-none"
          style={{ width: "min(82vw, 480px)", aspectRatio: "1 / 1" }}
        >
          {/* z:1 — logo-6: outer hexagon frame (LOWEST z-index, appears LAST) */}
          <div ref={r6} style={{ ...base, opacity: 0, zIndex: 1, filter: "contrast(0.05) brightness(5)" }}>
            <img src="/logo-6.svg" alt="Hexagon frame" className="w-full h-full object-contain" draggable={false} loading="eager" />
          </div>

          {/* z:2 — logo-7: tagline (below forest so forest is not covered) */}
          <div ref={r7} style={{ ...base, opacity: 0, zIndex: 2, filter: "contrast(0.08) brightness(3.5)" }}>
            <img src="/logo-7.svg" alt="Tagline" className="w-full h-full object-contain" draggable={false} loading="eager" />
          </div>

          {/* z:3 — logo-1: mountains */}
          <div ref={r1} style={{ ...base, opacity: 0, zIndex: 3 }}>
            <img src="/logo-1.svg" alt="Mountains" className="w-full h-full object-contain" draggable={false} loading="eager" />
          </div>

          {/* z:4 — logo-2: forest landscape (above tagline) */}
          <div ref={r2} style={{ ...base, opacity: 0, zIndex: 4 }}>
            <img src="/logo-2.svg" alt="Forest" className="w-full h-full object-contain" draggable={false} loading="eager" />
          </div>

          {/* z:5 — logo-5: RetrorikA wordmark */}
          <div ref={r5} style={{ ...base, opacity: 0, zIndex: 7 }}>
            <img src="/logo-5.svg" alt="RetrorikA" className="w-full h-full object-contain" draggable={false} loading="eager" />
          </div>

          {/* z:6 — logo-4: coffee tree branches */}
          <div ref={r4} style={{ ...base, opacity: 0, zIndex: 6 }}>
            <img src="/logo-4.svg" alt="Coffee tree" className="w-full h-full object-contain" draggable={false} loading="eager" />
          </div>

          {/* z:7 — logo-3: bird (highest layer) */}
          <div ref={r3} style={{ ...base, opacity: 0, zIndex: 7 }}>
            <img src="/logo-3.svg" alt="Sparrow" className="w-full h-full object-contain" draggable={false} loading="eager" />
          </div>

          {/* Text labels - positioned below each logo during scatter phase */}
          <div 
            ref={t1} 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center"
            style={{ opacity: 0, zIndex: 8 }}
          >
            <span className="text-sm md:text-base lg:text-lg text-stone-500 italic tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Mountain
            </span>
          </div>

          <div 
            ref={t2} 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center"
            style={{ opacity: 0, zIndex: 8 }}
          >
            <span className="text-sm md:text-base lg:text-lg text-stone-500 italic tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Forest
            </span>
          </div>

          <div 
            ref={t3} 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center"
            style={{ opacity: 0, zIndex: 8 }}
          >
            <span className="text-sm md:text-base lg:text-lg text-stone-500 italic tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sparrow
            </span>
          </div>

          <div 
            ref={t4} 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center"
            style={{ opacity: 0, zIndex: 8 }}
          >
            <span className="text-sm md:text-base lg:text-lg text-stone-500 italic tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tree
            </span>
          </div>

          <div 
            ref={t5} 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center"
            style={{ opacity: 0, zIndex: 8 }}
          >
            <span className="text-sm md:text-base lg:text-lg text-stone-500 italic tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              RetrorikA
            </span>
          </div>
        </div>

        {/* PHASE 3: Text reveal */}
        <div 
          className={`absolute flex flex-col items-center text-center ${isMobile ? 'w-[95%] px-0' : 'max-w-2xl px-6'}`}
          style={{ 
            top: isMobile ? "54%" : "58%", 
            left: "50%", 
            transform: "translateX(-50%)"
          }}
        >
          <p ref={textLine1Ref} className={`${isMobile ? 'text-base leading-normal' : 'text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl'} font-light text-gray-500 ${isMobile ? 'tracking-tight' : 'tracking-wide'} mb-1`} style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
            Retrorika adalah satu-satunya
          </p>
          <p ref={textLine2Ref} className={`${isMobile ? 'text-base leading-normal' : 'text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl'} font-light text-gray-500 ${isMobile ? 'tracking-tight' : 'tracking-wide'} mb-1`} style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
            resto yang menerapkan prinsip
          </p>
          <p ref={textLine3Ref} className={`${isMobile ? 'text-lg leading-relaxed' : 'text-base sm:text-lg md:text-2xl lg:text-2xl xl:text-3xl'} leading-relaxed text-gray-700 ${isMobile ? 'tracking-tight' : 'tracking-widest'} mb-1`} style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
            less waste · low carbon
          </p>
          <p ref={textLine4Ref} className={`${isMobile ? 'text-base leading-normal' : 'text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl'} font-light text-gray-500 ${isMobile ? 'tracking-tight' : 'tracking-wide'}`} style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
            di Indonesia
          </p>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none hidden" //hidden from now 
          style={{ opacity: 0.35 }}
        >
          <span
            className="text-stone-500 text-[9px] tracking-[0.28em] uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            scroll
          </span>
          <div className="w-px h-5 bg-stone-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
