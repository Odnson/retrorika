import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DARK_GRAY = "#4A4A4A";
const LIGHT_NEUTRAL = "#EDEDED";
const LIGHT_GRAY = "#F5F5F5";

export default function MenuNarrativeSection() {
  // Phase 2 refs
  const phase2ContainerRef = useRef<HTMLDivElement>(null);
  const phase2TextRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLImageElement>(null);
  const rightImageRef = useRef<HTMLImageElement>(null);

  // Phase 3 refs
  const phase3ContainerRef = useRef<HTMLDivElement>(null);
  const phase3ImageRef = useRef<HTMLImageElement>(null);
  const phase3TextRef = useRef<HTMLDivElement>(null);
  const phase3LabelRef = useRef<HTMLDivElement>(null);

  const [hasScrambled, setHasScrambled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrambleText = (
    element: HTMLElement,
    finalText: string,
    duration: number = 1000
  ) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let frame = 0;
    const totalFrames = duration / 16;

    const interval = setInterval(() => {
      const progress = frame / totalFrames;

      let scrambled = "";
      for (let i = 0; i < finalText.length; i++) {
        if (progress * finalText.length > i) {
          scrambled += finalText[i];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      element.textContent = scrambled;
      frame++;

      if (frame >= totalFrames) {
        clearInterval(interval);
        element.textContent = finalText;
      }
    }, 16);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const isMobileView = window.innerWidth < 768;

    // PHASE 2 → PHASE 3 Transition (0-65%)
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "0% top",
        end: isMobileView ? "70% top" : "55% top",
        scrub: 0.7,
        onLeaveBack: () => {
          setHasScrambled(false);
          if (phase2TextRef.current) {
            const h2 = phase2TextRef.current.querySelector("h2");
            if (h2) {
              h2.textContent = "When passion meets art";
            }
          }
        },
      },
    });

    // Trigger text scramble early
    tl1.call(() => {
      if (!hasScrambled) {
        setHasScrambled(true);
        if (phase2TextRef.current) {
          const h2 = phase2TextRef.current.querySelector("h2");
          if (h2) {
            scrambleText(h2, "When passion meets art", 600);
          }
        }
      }
    }, [], 0);

    // Phase 2 background fade in
    tl1.to(
      phase2ContainerRef.current,
      {
        backgroundColor: LIGHT_NEUTRAL,
        opacity: 1,
        ease: "power3.inOut",
        duration: 0.6,
      },
      0
    );

    // Text moves to center with smooth animation
    if (phase2TextRef.current) {
      const heading = phase2TextRef.current.querySelector("h2");

      tl1.to(
        phase2TextRef.current,
        {
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          ease: "power3.inOut",
          duration: 0.9,
        },
        0
      );

      if (heading) {
        tl1.to(
          heading,
          {
            color: DARK_GRAY,
            textAlign: "center",
            ease: "power2.inOut",
            duration: 0.7,
          },
          isMobileView ? 0.15 : 0.2
        );
      }
    }

    // Left image - slide from left with fade, blur to clear
    if (leftImageRef.current) {
      tl1.fromTo(
        leftImageRef.current,
        {
          opacity: 0,
          x: -120,
          scale: 0.85,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          duration: 0.9,
        },
        isMobileView ? 0.1 : 0.2
      );
    }

    // Right image - slide from right with fade, blur to clear
    if (rightImageRef.current) {
      tl1.fromTo(
        rightImageRef.current,
        {
          opacity: 0,
          x: 120,
          scale: 0.85,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          duration: 0.9,
        },
        isMobileView ? 0.2 : 0.3
      );
    }

    // PHASE 3 Transition (65-100%)
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: isMobileView ? "70% top" : "55% top",
        end: "100% top",
        scrub: 0.8,
      },
    });

    // Phase 2 content fades out
    tl2.to(
      phase2TextRef.current,
      {
        opacity: 0,
        y: -30,
        ease: "power3.inOut",
        duration: 0.5,
      },
      0
    );

    tl2.to(
      [leftImageRef.current, rightImageRef.current],
      {
        opacity: 0,
        scale: 0.95,
        ease: "power2.inOut",
        duration: 0.5,
      },
      0.05
    );

    tl2.to(
      phase2ContainerRef.current,
      {
        opacity: 0,
        ease: "power2.inOut",
        duration: 0.6,
      },
      0.1
    );

    // Phase 3 background fades in
    tl2.fromTo(
      phase3ContainerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        ease: "power3.inOut",
        duration: isMobileView ? 0.7 : 0.5,
      },
      isMobileView ? 0.2 : 0.25
    );

    // Phase 3 label appears
    if (phase3LabelRef.current) {
      tl2.fromTo(
        phase3LabelRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          duration: 0.5,
        },
        isMobileView ? 0.35 : 0.4
      );
    }

    // Phase 3 image slides from left with blur transition
    if (phase3ImageRef.current) {
      tl2.fromTo(
        phase3ImageRef.current,
        {
          opacity: 0,
          x: -100,
          scale: 0.9,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          duration: 0.9,
        },
        isMobileView ? 0.25 : 0.3
      );
    }

    // Phase 3 text slides from right with enhanced stagger
    if (phase3TextRef.current) {
      const textLines = phase3TextRef.current.querySelectorAll(".text-line");

      tl2.fromTo(
        textLines,
        {
          opacity: 0,
          x: 80,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          stagger: {
            amount: isMobileView ? 0.4 : 0.3,
            ease: "power1.inOut",
          },
          ease: "power3.out",
          duration: 0.6,
        },
        isMobileView ? 0.4 : 0.45
      );
    }

    // Subtle parallax effects
    if (!isMobileView) {
      // Desktop parallax for images
      gsap.to([leftImageRef.current, rightImageRef.current], {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "0% top",
          end: "60% top",
          scrub: 1.8,
        },
      });

      gsap.to(phase3ImageRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "60% top",
          end: "100% top",
          scrub: 1.8,
        },
      });
    } else {
      // Mobile: minimal parallax for smooth performance
      gsap.to([leftImageRef.current, rightImageRef.current], {
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "0% top",
          end: "60% top",
          scrub: 2.5,
        },
      });

      gsap.to(phase3ImageRef.current, {
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "60% top",
          end: "100% top",
          scrub: 2.5,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [hasScrambled]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* PHASE 2: Artistic Transition */}
      <div
        ref={phase2ContainerRef}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "white" }}
      >
        {/* Left Image */}
        <img
          ref={leftImageRef}
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&h=600&fit=crop"
          alt="Outdoor café warmth"
          className="absolute left-0 top-0 w-1/2 md:w-1/3 h-full object-cover opacity-0"
        />

        {/* Center Text */}
        <div
          ref={phase2TextRef}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 px-8"
          style={{ maxWidth: "600px" }}
        >
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            style={{ color: "#1a1a1a", transition: "color 0.3s ease" }}
          >
            When passion meets art
          </h2>
        </div>

        {/* Right Image */}
        <img
          ref={rightImageRef}
          src="https://images.unsplash.com/photo-1445521458279-0d8890f6db4d?w=500&h=600&fit=crop"
          alt="Coffee counter industrial"
          className="absolute right-0 top-0 w-1/2 md:w-1/3 h-full object-cover opacity-0"
        />
      </div>

      {/* PHASE 3: Menu Narrative */}
      <div
        ref={phase3ContainerRef}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: LIGHT_GRAY }}
      >
        {/* Label */}
        <div
          ref={phase3LabelRef}
          className="absolute top-8 right-8 md:top-16 md:right-16 text-xs md:text-sm tracking-widest font-light opacity-0 z-20"
          style={{ color: DARK_GRAY, letterSpacing: "0.2em" }}
        >
          OUR MENU
        </div>

        {/* Left Image */}
        <img
          ref={phase3ImageRef}
          src="https://images.unsplash.com/photo-1414432579143-7282515cda23?w=700&h=900&fit=crop"
          alt="Café interior menu"
          className="absolute left-0 top-0 w-full md:w-1/2 h-full object-cover opacity-0"
        />

        {/* Right Text */}
        <div
          ref={phase3TextRef}
          className="absolute left-0 top-0 w-full md:right-0 md:left-auto md:w-1/2 h-full flex flex-col items-center md:items-end justify-center p-8 md:p-16 text-center md:text-right opacity-100"
          style={{ color: DARK_GRAY }}
        >
          <div className="max-w-xs md:max-w-sm">
            <p className="text-base md:text-lg lg:text-xl leading-relaxed font-light tracking-tight">
              <span className="text-line block">Food should be</span>
              <span className="text-line block">delicious, and so</span>
              <span className="text-line block">should coffee. But</span>
              <span className="text-line block">satisfying meals</span>
              <span className="text-line block">with value are only</span>
              <span className="text-line block">in Retrorika</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
