import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAVY = "#06111e";
const BEIGE = "#f4f1ed";
const NAVY_LIGHT = "rgba(6,17,30,0.45)";

export default function DataangPergiSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for all animated elements
  const introRef = useRef<HTMLDivElement>(null);
  const introGhostRef = useRef<HTMLDivElement>(null);
  const bg01Ref = useRef<HTMLDivElement>(null);
  const bg02Ref = useRef<HTMLDivElement>(null);
  const num01Ref = useRef<HTMLSpanElement>(null);
  const line01Ref = useRef<HTMLDivElement>(null);
  const line01InnerRef = useRef<HTMLDivElement>(null);
  const text01Ref = useRef<HTMLParagraphElement>(null);
  const num02Ref = useRef<HTMLSpanElement>(null);
  const line02Ref = useRef<HTMLDivElement>(null);
  const line02InnerRef = useRef<HTMLDivElement>(null);
  const text02Ref = useRef<HTMLParagraphElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  // GSAP Timeline with scrub - like LogoRetorikaSectionV2
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: isMobile ? 0.5 : 1, // Faster scrub on mobile
        },
      });

      // ══════════════════════════════════════════════
      //  PHASE 1 — INTRO TEXT (0 → 1.5)
      // ══════════════════════════════════════════════
      tl.fromTo(introRef.current,
        { opacity: 0, y: 40, rotate: -2 },
        { opacity: 1, y: 0, rotate: 0, duration: 0.8, ease: "power2.out" },
        0
      );
      tl.to(introRef.current,
        { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" },
        0.9
      );

      // ══════════════════════════════════════════════
      //  PHASE 1.5 — INTRO GHOST (1 → 2)
      // ══════════════════════════════════════════════
      tl.fromTo(introGhostRef.current,
        { opacity: 0, scale: 1 },
        { opacity: 0.055, scale: 1.15, duration: 1, ease: "power1.inOut" },
        1
      );
      tl.to(introGhostRef.current,
        { opacity: 0, duration: 0.5, ease: "power2.in" },
        2
      );

      // ══════════════════════════════════════════════
      //  PHASE 2 — ITEM 01 (1.5 → 3.5)
      // ══════════════════════════════════════════════
      // BG Ghost 01
      tl.fromTo(bg01Ref.current,
        { opacity: 0, x: "6vw" },
        { opacity: 0.055, x: "0vw", duration: 1, ease: "power2.out" },
        1.5
      );
      tl.to(bg01Ref.current,
        { opacity: 0, duration: 0.5, ease: "power2.in" },
        3
      );

      // Number 01
      tl.fromTo(num01Ref.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        1.6
      );
      tl.to(num01Ref.current,
        { scale: 1.35, duration: 0.6, ease: "power2.inOut" },
        2.6
      );
      tl.to(num01Ref.current,
        { opacity: 0.12, duration: 0.5, ease: "power2.in" },
        3.2
      );

      // Line 01
      tl.fromTo(line01Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        1.8
      );
      tl.fromTo(line01InnerRef.current,
        { width: "0%" },
        { width: "100%", duration: 0.8, ease: "power2.out" },
        1.8
      );
      tl.to(line01Ref.current,
        { opacity: 0, duration: 0.5, ease: "power2.in" },
        3.2
      );

      // Text 01
      tl.fromTo(text01Ref.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        2
      );
      tl.to(text01Ref.current,
        { opacity: 0, y: -32, duration: 0.5, ease: "power2.in" },
        3
      );

      // ══════════════════════════════════════════════
      //  PHASE 3 — ITEM 02 (3.5 → 5.5)
      // ══════════════════════════════════════════════
      // BG Ghost 02
      tl.fromTo(bg02Ref.current,
        { opacity: 0, x: "-6vw" },
        { opacity: 0.055, x: "0vw", duration: 1, ease: "power2.out" },
        3.5
      );
      tl.to(bg02Ref.current,
        { opacity: 0, duration: 0.5, ease: "power2.in" },
        5
      );

      // Number 02
      tl.fromTo(num02Ref.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        3.6
      );
      tl.to(num02Ref.current,
        { opacity: 0.1, duration: 0.5, ease: "power2.in" },
        5.2
      );

      // Line 02
      tl.fromTo(line02Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        3.8
      );
      tl.fromTo(line02InnerRef.current,
        { width: "0%" },
        { width: "100%", duration: 0.8, ease: "power2.out" },
        3.8
      );
      tl.to(line02Ref.current,
        { opacity: 0, duration: 0.5, ease: "power2.in" },
        5.2
      );

      // Text 02
      tl.fromTo(text02Ref.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        4
      );
      tl.to(text02Ref.current,
        { opacity: 0, y: -28, duration: 0.5, ease: "power2.in" },
        5
      );

      // ══════════════════════════════════════════════
      //  PHASE 4 — EXIT VEIL (5.5 → 6)
      // ══════════════════════════════════════════════
      tl.fromTo(veilRef.current,
        { opacity: 0 },
        { opacity: 0.72, duration: 0.5, ease: "power2.inOut" },
        5.5
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: "280vh", position: "relative", zIndex: 10 }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden light-section"
        style={{ height: "100dvh", background: BEIGE, color: NAVY, zIndex: 10 }}
      >

        {/* ── INTRO TEXT ── */}
        <div
          ref={introRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="text-center">
            {["Simple", "way to", "save our", "planet"].map((line, i) => (
              <p
                key={i}
                className="block"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.5rem, 8vw, 6rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: NAVY,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* ── INTRO GHOST (siluet) ── */}
        <div
          ref={introGhostRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <div className="text-center">
            {["Simple", "way to", "save our", "planet"].map((line, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.5rem, 8vw, 6rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: NAVY,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* ── Ghost background "01" (dari kanan) ── */}
        <div
          ref={bg01Ref}
          className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(46vw, 58vw, 68vw)",
              fontWeight: 900,
              color: NAVY,
              lineHeight: 0.88,
              marginRight: "-4vw",
              letterSpacing: "-0.04em",
            }}
          >
            01
          </span>
        </div>

        {/* ── Ghost background "02" (dari kiri) ── */}
        <div
          ref={bg02Ref}
          className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(46vw, 58vw, 68vw)",
              fontWeight: 900,
              color: NAVY,
              lineHeight: 0.88,
              marginLeft: "-4vw",
              letterSpacing: "-0.04em",
            }}
          >
            02
          </span>
        </div>


        {/* ── Main content ── */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 md:gap-14">

            {/* ITEM 01 */}
            <div>
              {/* Number + Line row */}
              <div className="flex items-end gap-5 md:gap-8 mb-5 md:mb-7">
                <span
                  ref={num01Ref}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3.8rem, 9vw, 7.5rem)",
                    fontWeight: 800,
                    lineHeight: 1,
                    color: NAVY,
                    transformOrigin: "left bottom",
                    display: "block",
                    letterSpacing: "-0.02em",
                    opacity: 0,
                  }}
                >
                  01
                </span>

                <div
                  ref={line01Ref}
                  className="flex-1 mb-3 md:mb-4 overflow-hidden"
                  style={{ opacity: 0 }}
                >
                  <div
                    ref={line01InnerRef}
                    style={{
                      height: "1px",
                      background: NAVY_LIGHT,
                      width: "0%",
                    }}
                  />
                </div>
              </div>

              {/* Text */}
              <p
                ref={text01Ref}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: NAVY,
                  fontSize: "clamp(1.25rem, 3vw, 2.4rem)",
                  lineHeight: 1.5,
                  paddingLeft: "clamp(0px, 1vw, 16px)",
                  opacity: 0,
                }}
              >
                Bijak dalam memesan makanan.
                <br />
                <em style={{ opacity: 0.6, fontStyle: "italic" }}>
                  Hindari membuang makanan.
                </em>
              </p>
            </div>

            {/* ITEM 02 */}
            <div>
              <div className="flex items-end gap-5 md:gap-8 mb-5 md:mb-7">
                <span
                  ref={num02Ref}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3.8rem, 9vw, 7.5rem)",
                    fontWeight: 800,
                    lineHeight: 1,
                    color: NAVY,
                    display: "block",
                    letterSpacing: "-0.02em",
                    opacity: 0,
                  }}
                >
                  02
                </span>

                <div
                  ref={line02Ref}
                  className="flex-1 mb-3 md:mb-4 overflow-hidden"
                  style={{ opacity: 0 }}
                >
                  <div
                    ref={line02InnerRef}
                    style={{
                      height: "1px",
                      background: NAVY_LIGHT,
                      width: "0%",
                    }}
                  />
                </div>
              </div>

              <p
                ref={text02Ref}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: NAVY,
                  fontSize: "clamp(1.25rem, 3vw, 2.4rem)",
                  lineHeight: 1.5,
                  paddingLeft: "clamp(0px, 1vw, 16px)",
                  opacity: 0,
                }}
              >
                Kalapun harus ada yang terbuang,
                <br />
                <em style={{ opacity: 0.6, fontStyle: "italic" }}>
                  sisakan waktu berdamai dengannya.
                </em>
              </p>
            </div>

          </div>
        </div>

        {/* ── Bottom vignette (always) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent, ${BEIGE}cc)`,
          }}
        />

        {/* ── Exit veil ── */}
        <div
          ref={veilRef}
          className="absolute inset-0 pointer-events-none"
          style={{ background: BEIGE, opacity: 0 }}
        />

      </div>
    </div>
  );
}
