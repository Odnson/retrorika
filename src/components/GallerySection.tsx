import React, { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "../lib/useLenis";
import {
  DESKTOP_CONFIG,
  TABLET_CONFIG,
  MOBILE_CONFIG,
  CARDS_DATA,
  GALLERY_COLORS,
  BREAKPOINTS,
  getGalleryConfig,
  getDeviceType,
  type GalleryCardConfig,
} from "../lib/galleryConfig";

gsap.registerPlugin(ScrollTrigger);

const { BEIGE, NAVY } = GALLERY_COLORS;

interface CardStackProps {
  cards: typeof CARDS_DATA;
  activeIndex: number;
  config: GalleryCardConfig;
  expandedCard: number | null;
  onExpand: (index: number | null) => void;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

function CardStack({ cards, activeIndex, config, expandedCard, onExpand, deviceType }: CardStackProps) {
  const isMobile = deviceType === 'mobile';
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevIndex = useRef(0);
  const isAnimating = useRef(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { cardWidth, cardHeight, offsetX, offsetY, skew, expandScale, expandX, expandY, containerWidthOffset, containerHeightOffset } = config;

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const stackPos = (i - activeIndex + cards.length) % cards.length;
      gsap.set(card, {
        x: stackPos * offsetX,
        y: -stackPos * offsetY,
        zIndex: cards.length - stackPos,
        skewY: skew,
        scale: 1 - stackPos * 0.03,
        opacity: stackPos < 3 ? 1 : 0,
      });
    });
    prevIndex.current = activeIndex;
  }, []);

  useEffect(() => {
    if (activeIndex === prevIndex.current || isAnimating.current) return;
    if (expandedCard !== null) return;
    
    isAnimating.current = true;
    const direction = activeIndex > prevIndex.current ? 1 : -1;
    
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        prevIndex.current = activeIndex;
      }
    });

    cards.forEach((_, i) => {
      const card = cardRefs.current[i];
      if (!card) return;
      
      const newStackPos = (i - activeIndex + cards.length) % cards.length;
      const oldStackPos = (i - prevIndex.current + cards.length) % cards.length;
      
      if (direction > 0 && oldStackPos === 0) {
        tl.to(card, {
          y: "+=400",
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        }, 0);
        
        tl.set(card, {
          x: (cards.length - 1) * offsetX,
          y: -(cards.length - 1) * offsetY,
          zIndex: 1,
          scale: 1 - (cards.length - 1) * 0.03,
        }, 0.4);
        
        tl.to(card, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        }, 0.5);
      } else if (direction < 0 && newStackPos === 0) {
        tl.fromTo(card, {
          y: -300,
          opacity: 0,
          x: 0,
          zIndex: cards.length,
          scale: 1,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "elastic.out(0.8, 0.6)",
        }, 0);
      } else {
        tl.to(card, {
          x: newStackPos * offsetX,
          y: -newStackPos * offsetY,
          zIndex: cards.length - newStackPos,
          scale: 1 - newStackPos * 0.03,
          opacity: newStackPos < 3 ? 1 : 0,
          duration: 0.6,
          ease: "elastic.out(0.8, 0.6)",
        }, direction > 0 ? 0.15 : 0.1);
      }
    });

  }, [activeIndex, cards.length, offsetX, offsetY, skew, expandedCard]);

  // Handle expand animation
  useEffect(() => {
    cards.forEach((_, i) => {
      const card = cardRefs.current[i];
      if (!card) return;

      if (expandedCard === i) {
        // Expand to center of screen using config values
        gsap.to(card, {
          x: expandX,
          y: expandY,
          scale: expandScale,
          skewY: 0,
          zIndex: 100,
          duration: 0.5,
          ease: "power3.out",
        });
      } else if (expandedCard !== null) {
        // Fade out and hide other cards
        gsap.to(card, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        // Return to stack position
        const stackPos = (i - activeIndex + cards.length) % cards.length;
        gsap.to(card, {
          x: stackPos * offsetX,
          y: -stackPos * offsetY,
          scale: 1 - stackPos * 0.03,
          skewY: skew,
          zIndex: cards.length - stackPos,
          opacity: stackPos < 3 ? 1 : 0,
          duration: 0.5,
          ease: "elastic.out(0.7, 0.7)",
        });
      }
    });
  }, [expandedCard, activeIndex, cards.length, offsetX, offsetY, skew, expandX, expandY, expandScale]);

  const handleCardClick = (index: number) => {
    // Only allow clicking the expanded card to close it
    if (expandedCard !== null) {
      if (expandedCard === index) {
        onExpand(null);
      }
      // Do nothing if clicking other cards while one is expanded
      return;
    }
    // Expand this card
    onExpand(index);
  };

  return (
    <div 
      className="relative"
      style={{ 
        width: cardWidth + offsetX * containerWidthOffset, 
        height: cardHeight + offsetY * containerHeightOffset,
        perspective: 1000,
      }}
    >
      {cards.map((card, i) => {
        const isHovered = hoveredCard === i;
        const isExpanded = expandedCard === i;
        const stackPos = (i - activeIndex + cards.length) % cards.length;
        const isFrontCard = stackPos === 0;
        
        return (
        <div
          key={i}
          ref={el => { cardRefs.current[i] = el; }}
          className={`absolute top-0 left-0 rounded-xl overflow-hidden will-change-transform transition-shadow duration-300 ${
            isHovered && !isExpanded && expandedCard === null ? 'shadow-2xl shadow-black/40' : ''
          } ${isExpanded ? 'shadow-2xl shadow-black/50 cursor-pointer' : ''} ${
            expandedCard === null ? 'cursor-pointer' : ''
          }`}
          style={{
            width: cardWidth,
            height: cardHeight,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            border: isHovered || isExpanded ? '2px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
            pointerEvents: expandedCard !== null && !isExpanded ? 'none' : 'auto',
          }}
          onClick={() => handleCardClick(i)}
          onMouseEnter={() => {
            if (expandedCard !== null) return;
            setHoveredCard(i);
            if (isFrontCard) {
              gsap.to(cardRefs.current[i], {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          }}
          onMouseLeave={() => {
            if (expandedCard !== null) return;
            setHoveredCard(null);
            if (isFrontCard) {
              gsap.to(cardRefs.current[i], {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          }}
        >
          <div className="w-full h-full relative">
            <div
              className="absolute inset-0"
              style={{ background: card.bg }}
            />
            
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)"
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")",
                backgroundSize: "200px 200px",
                mixBlendMode: "overlay",
                opacity: 0.3,
              }}
            />

            <span
              className={`absolute top-4 left-4 ${isMobile ? 'text-4xl' : 'text-6xl lg:text-7xl'} font-bold leading-none select-none`}
              style={{
                fontFamily: "'Playfair Display', serif",
                color: card.accent,
                opacity: 0.4,
              }}
            >
              {card.label}
            </span>

            <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'p-4' : 'p-5 lg:p-6'}`}>
              <p
                className={`${isMobile ? 'text-xs' : 'text-sm lg:text-base'} leading-relaxed text-white/90`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {card.text}
              </p>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}

// Text scramble utility
const scrambleText = (
  element: HTMLElement,
  finalText: string,
  duration: number = 1000
) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let frame = 0;
  const totalFrames = duration / 16;

  // Check if finalText contains HTML
  const hasHTML = finalText.includes('<br');
  
  if (hasHTML) {
    // Split by <br /> to get individual lines
    const lines = finalText.split('<br />');
    
    const interval = setInterval(() => {
      const progress = frame / totalFrames;
      
      let scrambledLines = lines.map(line => {
        let scrambled = "";
        for (let i = 0; i < line.length; i++) {
          if (progress * line.length > i) {
            scrambled += line[i];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        return scrambled;
      });
      
      element.innerHTML = scrambledLines.join('<br />');
      frame++;
      
      if (frame >= totalFrames) {
        clearInterval(interval);
        element.innerHTML = finalText;
      }
    }, 16);
  } else {
    // Original single-line scramble
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
  }
};

const GRAY = "#EDEDED";
const DARK_GRAY = "#4A4A4A";
const LIGHT_GRAY = "#F8F8F8";

export default function GallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const entryVeilRef = useRef<HTMLDivElement>(null);
  const exitVeilRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const textMobileRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerMobileRef = useRef<HTMLDivElement>(null);
  
  // Phase 2 refs
  const phase2ContainerRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);
  
  // Phase 3 refs
  const phase3ContainerRef = useRef<HTMLDivElement>(null);
  const phase3ImageRef = useRef<HTMLDivElement>(null);
  const phase3TextRef = useRef<HTMLDivElement>(null);
  const phase3LabelRef = useRef<HTMLDivElement>(null);
  
  const [activeCard, setActiveCard] = useState(0);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isInSection, setIsInSection] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [hasScrambled, setHasScrambled] = useState(false);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 600;

  // Get current config based on device type
  const currentConfig = useMemo(() => {
    return getGalleryConfig(
      deviceType === 'mobile' ? BREAKPOINTS.MOBILE - 1 :
      deviceType === 'tablet' ? BREAKPOINTS.TABLET - 1 :
      BREAKPOINTS.TABLET + 1
    );
  }, [deviceType]);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setDeviceType(getDeviceType(width));
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      // Entry veil
      gsap.fromTo(entryVeilRef.current,
        { opacity: 0.8 },
        {
          opacity: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "3% top",
            scrub: 0.3,
          }
        }
      );

      // Phase 1 - Initial gallery section (0-25%)
      [textRef.current, textMobileRef.current].forEach(el => {
        if (el) {
          gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: containerRef.current,
                start: "3% top",
                end: "8% top",
                scrub: 0.3,
              }
            }
          );
        }
      });

      [cardsContainerRef.current, cardsContainerMobileRef.current].forEach(el => {
        if (el) {
          gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: containerRef.current,
                start: "3% top",
                end: "8% top",
                scrub: 0.3,
              }
            }
          );
        }
      });

      // PHASE 1 → PHASE 2 Transition (30-42%)
      const isMobileView = window.innerWidth < 768;
      
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "30% top",
          end: isMobileView ? "50% top" : "42% top",
          scrub: 0.5,
          onLeaveBack: () => {
            // Reset text when scrolling back
            setHasScrambled(false);
            if (textRef.current) {
              const textElement = textRef.current.querySelector('h2');
              if (textElement) {
                textElement.innerHTML = "Bagaimana kami<br />berdamai dengan<br />sampah";
              }
            }
            if (textMobileRef.current) {
              const textElement = textMobileRef.current.querySelector('h2');
              if (textElement) {
                textElement.textContent = "Bagaimana kami berdamai dengan sampah";
              }
            }
          },
        },
      });

      // Cards animation - mobile: fade and scale, desktop: slide
      [cardsContainerRef.current, cardsContainerMobileRef.current].forEach((el, idx) => {
        if (el) {
          const isMobileEl = idx === 1; // Second one is mobile
          if (isMobileEl) {
            // Mobile: scale down and fade
            tl1.to(el, {
              scale: 0.85,
              opacity: 0,
              y: 30,
              ease: "power3.in",
              duration: 0.8,
            }, 0);
          } else {
            // Desktop: slide right and fade
            tl1.to(el, {
              x: 400,
              opacity: 0,
              ease: "power2.inOut",
            }, 0);
          }
        }
      });

      // Text moves to center (simultaneously with cards)
      [textRef.current, textMobileRef.current].forEach((el, idx) => {
        if (el) {
          const heading = el.querySelector('h2');
          const divider = el.querySelector('.divider');
          const indicators = el.querySelector('.indicators');
          const isMobileEl = idx === 1;
          
          tl1.to(el, {
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
            ease: "power2.inOut",
            duration: 0.8,
          }, 0);
          
          // Change text properties with stagger
          if (heading) {
            tl1.to(heading, {
              color: DARK_GRAY,
              textAlign: "center",
              ease: "power2.inOut",
              duration: 0.6,
            }, 0.1);
          }
          
          // Hide divider and indicators with stagger
          if (divider) {
            tl1.to(divider, { 
              opacity: 0, 
              scale: 0.8,
              ease: "back.in" 
            }, 0.2);
          }
          if (indicators) {
            tl1.to(indicators, { 
              opacity: 0,
              y: -10,
              ease: "power2.out" 
            }, 0.15);
          }
        }
      });

      // Trigger scramble when text reaches center with smooth timing
      tl1.call(() => {
        if (!hasScrambled) {
          setHasScrambled(true);
          if (textRef.current) {
            const textElement = textRef.current.querySelector('h2');
            if (textElement) {
              const originalText = textElement.textContent || "";
              const cleanText = originalText.replace(/\s+/g, ' ').trim();
              textElement.innerHTML = cleanText;
              scrambleText(textElement, "When<br />passion<br />meets<br />art", 600);
            }
          }
          if (textMobileRef.current) {
            const textElement = textMobileRef.current.querySelector('h2');
            if (textElement) {
              const originalText = textElement.textContent || "";
              const cleanText = originalText.replace(/\s+/g, ' ').trim();
              textElement.innerHTML = cleanText;
              scrambleText(textElement, "When passion meets art", isMobileView ? 400 : 600);
            }
          }
        }
      }, [], isMobileView ? 0.3 : 0.5);

      // Phase 2 background fades in smoothly
      tl1.to(phase2ContainerRef.current, {
        opacity: 1,
        ease: "power2.inOut",
        duration: 0.5,
      }, isMobileView ? 0.2 : 0.2);

      // Image animations - optimized for desktop, simpler for mobile
      if (!isMobileView) {
        // Left image - falls from top (with delay)
        tl1.fromTo(leftImageRef.current,
          { opacity: 0, y: -200, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 0.6 },
          0.8
        );

        // Right image - falls from bottom (with delay, slightly after left)
        tl1.fromTo(rightImageRef.current,
          { opacity: 0, y: 200, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 0.6 },
          0.95
        );
      }

      // PHASE 2 → PHASE 3 Transition (65-80%)
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "65% top",
          end: isMobileView ? "90% top" : "80% top",
          scrub: 1,
        },
      });

      // Everything from Phase 2 fades out with stagger on mobile
      if (isMobileView) {
        tl2.to(textRef.current, {
          opacity: 0,
          y: -20,
          ease: "power2.out",
          duration: 0.4,
        }, 0);
        
        tl2.to(textMobileRef.current, {
          opacity: 0,
          y: -20,
          ease: "power2.out",
          duration: 0.4,
        }, 0);
        
        tl2.to([leftImageRef.current, rightImageRef.current], {
          opacity: 0,
          ease: "power2.out",
          duration: 0.4,
        }, 0);
        
        tl2.to(phase2ContainerRef.current, {
          opacity: 0,
          ease: "power2.out",
          duration: 0.5,
        }, 0);
      } else {
        tl2.to([textRef.current, textMobileRef.current, leftImageRef.current, rightImageRef.current, phase2ContainerRef.current], {
          opacity: 0,
          ease: "power2.out",
        }, 0);
      }

      // Phase 3 background fades in
      tl2.fromTo(phase3ContainerRef.current,
        { opacity: 0 },
        { opacity: 1, ease: "power2.inOut", duration: 0.6 },
        isMobileView ? 0.15 : 0.3
      );

      // Phase 3 content appears with smooth sequence
      if (isMobileView) {
        // Mobile: stacked vertical layout with smooth reveal
        tl2.fromTo(phase3ImageRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, ease: "power3.out", duration: 0.6 },
          0.3
        );

        tl2.fromTo(phase3LabelRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.5 },
          0.45
        );
      } else {
        // Desktop: side-by-side with different timing
        tl2.fromTo(phase3ImageRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, ease: "power2.out", duration: 0.5 },
          0.4
        );

        tl2.fromTo(phase3LabelRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.4 },
          0.5
        );
      }

      // Text lines appear with stagger
      const textLines = phase3TextRef.current?.querySelectorAll(".text-line");
      if (textLines) {
        tl2.fromTo(textLines,
          { opacity: 0, y: 15 },
          { 
            opacity: 1, 
            y: 0, 
            stagger: isMobileView ? 0.08 : 0.05, 
            ease: "power3.out",
            duration: 0.4,
          },
          isMobileView ? 0.55 : 0.6
        );
      }

      // Exit veil
      gsap.fromTo(exitVeilRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "95% top",
            end: "bottom top",
            scrub: 0.3,
          }
        }
      );

      // Subtle parallax (simplified) - optimized for mobile
      if (!isMobileView) {
        // Desktop parallax effect
        gsap.to([leftImageRef.current, rightImageRef.current], {
          y: -30,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "30% top",
            end: "65% top",
            scrub: 1.5,
          },
        });

        gsap.to(phase3ImageRef.current, {
          y: -30,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "65% top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      } else {
        // Mobile: subtle parallax for performance
        gsap.to([leftImageRef.current, rightImageRef.current], {
          y: -15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "30% top",
            end: "65% top",
            scrub: 2,
          },
        });

        gsap.to(phase3ImageRef.current, {
          y: -15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "65% top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => setIsInSection(true),
        onLeave: () => setIsInSection(false),
        onEnterBack: () => setIsInSection(true),
        onLeaveBack: () => {
          setIsInSection(false);
          setActiveCard(0);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasScrambled]);

  // Handle card navigation via Lenis scroll
  useEffect(() => {
    if (!isInSection) return;

    const lenis = getLenis();
    let lastDirection = 0;
    let accumulatedScroll = 0;
    const scrollThreshold = 80; // Pixels needed to trigger card change

    const handleScroll = ({ direction, velocity }: { direction: number; velocity: number }) => {
      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) return;
      
      // Accumulate scroll in the same direction
      if (direction === lastDirection) {
        accumulatedScroll += Math.abs(velocity) * 10;
      } else {
        accumulatedScroll = Math.abs(velocity) * 10;
        lastDirection = direction;
      }

      // Trigger card change when threshold is reached
      if (accumulatedScroll >= scrollThreshold) {
        setActiveCard(prev => {
          const next = prev + direction;
          if (next < 0 || next > 2) return prev;
          lastScrollTime.current = now;
          accumulatedScroll = 0;
          return next;
        });
      }
    };

    // Use Lenis scroll event if available, fallback to native
    if (lenis) {
      lenis.on('scroll', handleScroll);
    }

    // Fallback for touch devices without Lenis sync
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) return;
      
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      
      if (Math.abs(diff) < 60) return;
      
      const direction = diff > 0 ? 1 : -1;
      
      setActiveCard(prev => {
        const next = prev + direction;
        if (next < 0 || next > 2) return prev;
        lastScrollTime.current = now;
        touchStartY = touchY; // Reset for continuous scroll
        return next;
      });
    };

    // Only add touch listeners on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    return () => {
      if (lenis) {
        lenis.off('scroll', handleScroll);
      }
      if (isMobile) {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isInSection]);

  const handleExpand = (index: number | null) => {
    setExpandedCard(index);
    if (index !== null) {
      lastScrollTime.current = Date.now();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ height: "400vh", position: "relative", zIndex: 20, marginTop: "-200px" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden light-section"
        style={{ height: "100dvh", background: BEIGE }}
      >
        <div
          ref={entryVeilRef}
          className="absolute inset-0 pointer-events-none"
          style={{ background: BEIGE, zIndex: 50 }}
        />

        {/* Backdrop overlay when card is expanded */}
        {expandedCard !== null && (
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm z-30 cursor-pointer"
            onClick={() => handleExpand(null)}
          >
            {/* Mobile hint - tap to close */}
            <div className="md:hidden absolute bottom-24 left-0 right-0 flex justify-center">
              <p 
                className="text-white/70 text-sm tracking-wider animate-pulse"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                tap card to close
              </p>
            </div>
          </div>
        )}

        {/* Desktop/Tablet Layout */}
        <div className="hidden md:block absolute inset-0">
          <div
            ref={textRef}
            className="absolute left-8 lg:left-16 xl:left-24 2xl:left-32 top-1/2 -translate-y-1/2 z-10 transition-all duration-500"
          >
            <h2
              className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light leading-tight max-w-md text-left"
              style={{ fontFamily: "'Playfair Display', serif", color: NAVY }}
            >
              Bagaimana kami<br />berdamai dengan<br />sampah
            </h2>
            <div className="divider w-12 h-px mt-6" style={{ background: NAVY, opacity: 0.3 }} />
            
            <div className="indicators flex gap-3 mt-8">
              {CARDS_DATA.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    background: NAVY,
                    opacity: activeCard === i ? 1 : 0.2,
                    width: activeCard === i ? 32 : 16,
                  }}
                />
              ))}
            </div>
          </div>

          <div
            ref={cardsContainerRef}
            className="absolute right-[3%] md:right-[5%] lg:right-[8%] xl:right-[10%] 2xl:right-[12%] bottom-[8%] md:bottom-[10%] lg:bottom-[12%]"
            style={{ zIndex: expandedCard !== null ? 35 : 20 }}
          >
            <CardStack 
              cards={CARDS_DATA} 
              activeIndex={activeCard} 
              config={deviceType === 'tablet' ? TABLET_CONFIG : DESKTOP_CONFIG}
              expandedCard={expandedCard} 
              onExpand={handleExpand}
              deviceType={deviceType}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden absolute inset-0 flex flex-col">
          <div
            ref={textMobileRef}
            className="flex-shrink-0 pt-16 px-6 text-center"
          >
            <h2
              className="text-lg font-light leading-tight px-4"
              style={{ fontFamily: "'Playfair Display', serif", color: NAVY }}
            >
              Bagaimana kami berdamai dengan sampah
            </h2>
            <div className="divider w-8 h-px mt-2 mx-auto" style={{ background: NAVY, opacity: 0.3 }} />
            
            <div className="indicators flex gap-2 mt-3 justify-center">
              {CARDS_DATA.map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    background: NAVY,
                    opacity: activeCard === i ? 1 : 0.2,
                    width: activeCard === i ? 20 : 10,
                  }}
                />
              ))}
            </div>
          </div>

          <div
            ref={cardsContainerMobileRef}
            className="flex-1 flex items-center justify-center"
            style={{ zIndex: expandedCard !== null ? 35 : 20, marginTop: '20px' }}
          >
            <CardStack 
              cards={CARDS_DATA} 
              activeIndex={activeCard} 
              config={MOBILE_CONFIG}
              expandedCard={expandedCard} 
              onExpand={handleExpand}
              deviceType="mobile"
            />
          </div>
        </div>

        {/* PHASE 2 - Artistic Statement */}
        <div
          ref={phase2ContainerRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{ background: GRAY }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Left Image - Hidden on mobile */}
            <div
              ref={leftImageRef}
              className="hidden md:block relative h-full overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/KLN09460-1.jpg.jpeg')",
                  filter: "brightness(0.85) contrast(1.1)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, transparent 60%, rgba(237,237,237,0.3) 100%)",
                }}
              />
            </div>

            {/* Center - Empty, text will be positioned here from Phase 1 */}
            <div className="flex items-center justify-center px-8 md:px-12">
              {/* Text comes from Phase 1 animation */}
            </div>

            {/* Right Image - Hidden on mobile */}
            <div
              ref={rightImageRef}
              className="hidden md:block relative h-full overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/KLN09442-2.jpg.jpeg')",
                  filter: "brightness(0.85) contrast(1.1)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to left, transparent 60%, rgba(237,237,237,0.3) 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* PHASE 3 - Menu Narrative */}
        <div
          ref={phase3ContainerRef}
          className="absolute inset-0 opacity-0"
          style={{ background: LIGHT_GRAY }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-0">
            {/* Left Image */}
            <div
              ref={phase3ImageRef}
              className="relative h-full overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/KLN09431-1.jpg.jpeg')",
                  filter: "brightness(0.9) contrast(1.05)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 50%)",
                }}
              />
            </div>

            {/* Right Text Block */}
            <div className="relative flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-24 py-12">
              <div
                ref={phase3LabelRef}
                className="mb-6 md:mb-8 opacity-0"
              >
              </div>

              <div ref={phase3TextRef}>
                <h3
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: NAVY,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span className="text-line block mb-2">Food should be</span>
                  <span className="text-line block mb-2">delicious, and</span>
                  <span className="text-line block mb-2">so should</span>
                  <span className="text-line block mb-2">coffee.</span>
                  <span className="text-line block mt-6 mb-2">But satisfying</span>
                  <span className="text-line block mb-2">meals with</span>
                  <span className="text-line block mb-2">value are only</span>
                  <span className="text-line block">in Retrorika</span>
                </h3>
              </div>

              <div className="mt-8 md:mt-12">
                <div
                  className="w-16 h-px"
                  style={{ background: NAVY, opacity: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          ref={exitVeilRef}
          className="absolute inset-0 pointer-events-none"
          style={{ background: NAVY, zIndex: 40 }}
        />
      </div>
    </div>
  );
}
