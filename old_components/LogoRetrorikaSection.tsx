// import { useRef, useEffect, useState, useCallback } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";

// // Utility functions for smooth interpolation
// function lerp(a: number, b: number, t: number) {
//   return a + (b - a) * Math.max(0, Math.min(1, t));
// }

// function norm(val: number, lo: number, hi: number) {
//   return Math.max(0, Math.min(1, (val - lo) / (hi - lo)));
// }

// function easeInOut(t: number) {
//   return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
// }

// function easeSmoothStep(t: number) {
//   return t * t * (3 - 2 * t);
// }

// export default function LogoRetrorikaSection() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const stickyRef = useRef<HTMLDivElement>(null);
  
//   // Refs for each logo element
//   const logo1Ref = useRef<HTMLDivElement>(null);
//   const logo2Ref = useRef<HTMLDivElement>(null);
//   const logo3Ref = useRef<HTMLDivElement>(null);
//   const logo4Ref = useRef<HTMLDivElement>(null);
//   const logo5Ref = useRef<HTMLDivElement>(null);
  
//   // Refs for assembled layers
//   const layer0Ref = useRef<HTMLDivElement>(null); // border
//   const layer1Ref = useRef<HTMLDivElement>(null); // fill
//   const layer2Ref = useRef<HTMLDivElement>(null); // mountain
//   const layer3Ref = useRef<HTMLDivElement>(null); // tree
//   const layer4Ref = useRef<HTMLDivElement>(null); // text
//   const layer5Ref = useRef<HTMLDivElement>(null); // forest
//   const layer6Ref = useRef<HTMLDivElement>(null); // sparrow
  
//   const fullLogoRef = useRef<HTMLDivElement>(null);
//   const textLine1Ref = useRef<HTMLParagraphElement>(null);
//   const textLine2Ref = useRef<HTMLParagraphElement>(null);
//   const textLine3Ref = useRef<HTMLParagraphElement>(null);
//   const textLine4Ref = useRef<HTMLParagraphElement>(null);
//   const textLine5Ref = useRef<HTMLParagraphElement>(null);
  
//   const [isMobile, setIsMobile] = useState(false);
//   const progressRef = useRef(0);
//   const frameRef = useRef(0);


//   // Detect mobile/tablet
//   useEffect(() => {
//     const checkDevice = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkDevice();
//     window.addEventListener('resize', checkDevice, { passive: true });
//     return () => window.removeEventListener('resize', checkDevice);
//   }, []);

//   // Single scroll progress for minimal overhead
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start end", "end start"],
//   });

//   // Only essential transforms - delayed to allow dissolve to show
//   const panelY = useTransform(scrollYProgress, [0, 0.15], ["100%", "0%"]);


//   // Main draw function - pure calculations, no anime.js
//   const draw = useCallback(() => {
//     const p = progressRef.current;
    
//     // Phase 1: Intro logos fade in (0 - 0.20)
//     const introFade = easeSmoothStep(norm(p, 0, 0.20));
    
//     // Phase 2: Assembly animation (0.20 - 0.45)
//     const assemblyProgress = easeSmoothStep(norm(p, 0.20, 0.45));
    
//     // Phase 3: Assembled layers appear (0.35 - 0.55)
//     const layersProgress = easeSmoothStep(norm(p, 0.35, 0.55));
    
//     // Phase 4: Fade to full logo (0.55 - 0.65)
//     const fullLogoFade = easeSmoothStep(norm(p, 0.55, 0.65));
    
//     // Phase 5: Move logo up (0.65 - 0.75)
//     const logoMoveProgress = easeSmoothStep(norm(p, 0.65, 0.75));
    
//     // Phase 6: Text reveal (0.70 - 0.95)
//     const textRevealProgress = easeSmoothStep(norm(p, 0.70, 0.95));
    
//     // Apply intro logos animations
//     if (logo1Ref.current) {
//       const opacity = introFade * (1 - assemblyProgress);
//       const moveX = isMobile ? assemblyProgress * 100 : assemblyProgress * 580;
//       const moveY = isMobile ? assemblyProgress * 180 : assemblyProgress * 240;
//       logo1Ref.current.style.opacity = `${opacity}`;
//       logo1Ref.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
//     }
    
//     if (logo2Ref.current) {
//       const opacity = introFade * (1 - assemblyProgress);
//       const moveX = isMobile ? assemblyProgress * -100 : assemblyProgress * 250;
//       const moveY = isMobile ? assemblyProgress * 160 : assemblyProgress * 260;
//       logo2Ref.current.style.opacity = `${opacity}`;
//       logo2Ref.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
//     }
    
//     if (logo3Ref.current) {
//       const opacity = introFade * (1 - assemblyProgress);
//       const moveX = isMobile ? assemblyProgress * 100 : assemblyProgress * -260;
//       const moveY = isMobile ? assemblyProgress * -160 : assemblyProgress * 260;
//       logo3Ref.current.style.opacity = `${opacity}`;
//       logo3Ref.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
//     }
    
//     if (logo4Ref.current) {
//       const opacity = introFade * (1 - assemblyProgress);
//       const moveX = isMobile ? assemblyProgress * -100 : assemblyProgress * -580;
//       const moveY = isMobile ? assemblyProgress * -180 : assemblyProgress * 280;
//       logo4Ref.current.style.opacity = `${opacity}`;
//       logo4Ref.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
//     }
    
//     if (logo5Ref.current) {
//       const opacity = introFade * (1 - assemblyProgress);
//       const moveY = isMobile ? 0 : assemblyProgress * -20;
//       logo5Ref.current.style.opacity = `${opacity}`;
//       logo5Ref.current.style.transform = `translateY(${moveY}px)`;
//     }
    
//     // Apply assembled layers animations (staggered appearance)
//     const layerTimings = [
//       { ref: layer6Ref, delay: 0 },      // sparrow
//       { ref: layer3Ref, delay: 0.05 },   // tree
//       { ref: layer5Ref, delay: 0.10 },   // forest
//       { ref: layer2Ref, delay: 0.15 },   // mountain
//       { ref: layer4Ref, delay: 0.20 },   // text
//       { ref: layer1Ref, delay: 0.20 },   // fill
//       { ref: layer0Ref, delay: 0.25 },   // border
//     ];
    
//     layerTimings.forEach(({ ref, delay }) => {
//       if (ref.current) {
//         const layerFade = easeSmoothStep(norm(layersProgress, delay, delay + 0.15));
//         const opacity = layerFade * (1 - fullLogoFade);
//         const scale = ref === layer0Ref ? lerp(2, 1, layerFade) : 1;
//         ref.current.style.opacity = `${opacity}`;
//         ref.current.style.transform = `scale(${scale})`;
//       }
//     });
    
//     // Apply full logo animations
//     if (fullLogoRef.current) {
//       const opacity = fullLogoFade;
//       const moveY = logoMoveProgress * -80;
//       const scale = lerp(1, 0.9, logoMoveProgress);
//       fullLogoRef.current.style.opacity = `${opacity}`;
//       fullLogoRef.current.style.transform = `translate(-50%, -50%) translateY(${moveY}px) scale(${scale})`;
//     }
    
//     // Apply text reveal animations (staggered)
//     const textRefs = [textLine1Ref, textLine2Ref, textLine3Ref, textLine4Ref, textLine5Ref];
//     textRefs.forEach((ref, i) => {
//       if (ref.current) {
//         const textDelay = i * 0.08;
//         const textFade = easeSmoothStep(norm(textRevealProgress, textDelay, textDelay + 0.20));
//         const moveY = lerp(20, 0, textFade);
//         ref.current.style.opacity = `${textFade}`;
//         ref.current.style.transform = `translateY(${moveY}px)`;
//       }
//     });
//   }, [isMobile]);


//   // RAF loop for smooth animation
//   useEffect(() => {
//     const loop = () => {
//       draw();
//       frameRef.current = requestAnimationFrame(loop);
//     };
//     frameRef.current = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(frameRef.current);
//   }, [draw]);

//   // Update progress from scroll
//   useEffect(() => {
//     return scrollYProgress.on('change', (v) => {
//       progressRef.current = v;
//     });
//   }, [scrollYProgress]);

//   return (
//     <div 
//       ref={containerRef} 
//       style={{ height: "450vh", marginTop: "0vh" }} 
//       className="relative z-30"
//     >
//       <motion.div 
//         ref={stickyRef}
//         className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-[#f9f7f4] light-section"
//         style={{ 
//           y: panelY,
//           // Mobile optimization
//           WebkitTransform: "translateZ(0)",
//           transform: "translateZ(0)",
//         }}
//       >
        
//         {/* PHASE 1-2: Intro logos */}
//         <div 
//           className="absolute inset-0 flex flex-col items-center" 
//           style={{ paddingTop: isMobile ? "10vh" : "2vh" }}
//         >
//           {isMobile ? (
//             <>
//               <div className="flex items-start justify-between w-full px-4 mb-16">
//                 <div ref={logo1Ref} className="flex flex-col items-center" style={{ opacity: 0 }}>
//                   <img src="/logo-1.svg" alt="Mountain" className="w-32 h-auto object-contain" loading="eager" />
//                   <span className="block mt-2 text-sm text-gray-400 italic text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Mountain
//                   </span>
//                 </div>
//                 <div ref={logo2Ref} className="flex flex-col items-center" style={{ opacity: 0 }}>
//                   <img src="/logo-2.svg" alt="Tree" className="w-40 h-auto object-contain" loading="eager" />
//                   <span className="block mt-2 text-sm text-gray-400 italic text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Tree
//                   </span>
//                 </div>
//               </div>

//               <div ref={logo5Ref} className="mb-16" style={{ opacity: 0 }}>
//                 <img src="/logo-5.svg" alt="Retrorika" className="w-64 h-auto object-contain" loading="eager" />
//               </div>

//               <div className="flex items-end justify-between w-full px-4">
//                 <div ref={logo3Ref} className="flex flex-col items-center" style={{ opacity: 0 }}>
//                   <img src="/logo-3.svg" alt="Sparrow" className="w-28 h-auto object-contain" loading="eager" />
//                   <span className="block mt-2 text-sm text-gray-400 italic text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Sparrow
//                   </span>
//                 </div>
//                 <div ref={logo4Ref} className="flex flex-col items-center" style={{ opacity: 0 }}>
//                   <img src="/logo-4.svg" alt="Forest" className="w-40 h-auto object-contain" loading="eager" />
//                   <span className="block mt-2 text-sm text-gray-400 italic text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Forest
//                   </span>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="flex items-end justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-20 mb-8">
//                 <div ref={logo1Ref} className="flex flex-col items-center" style={{ opacity: 0 }}>
//                   <img src="/logo-1.svg" alt="Mountain" className="w-20 h-16 sm:w-28 sm:h-22 md:w-36 md:h-28 xl:w-96 xl:h-auto object-contain" loading="eager" />
//                   <span className="block mt-2 text-xs sm:text-sm md:text-2xl xl:text-4xl text-gray-500 italic text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Mountain
//                   </span>
//                 </div>

//                 <div ref={logo2Ref} className="flex flex-col items-center mb-4" style={{ opacity: 0 }}>
//                   <img src="/logo-2.svg" alt="Tree" className="w-20 h-16 sm:w-28 sm:h-22 md:w-36 md:h-28 xl:w-96 xl:h-auto object-contain" loading="eager" />
//                   <span className="block mt-2 text-xs sm:text-sm md:text-2xl xl:text-4xl text-gray-500 italic text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Tree
//                   </span>
//                 </div>

//                 <div ref={logo3Ref} className="flex flex-col items-center" style={{ opacity: 0 }}>
//                   <img src="/logo-3.svg" alt="Sparrow" className="w-20 h-16 sm:w-28 sm:h-22 md:w-36 md:h-28 xl:w-96 xl:h-auto object-contain" loading="eager" />
//                   <span className="block mt-2 text-xs sm:text-sm md:text-2xl xl:text-4xl text-gray-500 italic text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Sparrow
//                   </span>
//                 </div>

//                 <div ref={logo4Ref} className="flex flex-col items-center mb-8" style={{ opacity: 0 }}>
//                   <img src="/logo-4.svg" alt="Forest" className="w-20 h-16 sm:w-28 sm:h-22 md:w-36 md:h-28 xl:w-96 xl:h-auto object-contain" loading="eager" />
//                   <span className="block mt-0 text-xs sm:text-sm md:text-2xl xl:text-4xl text-gray-500 italic text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
//                     Forest
//                   </span>
//                 </div>
//               </div>

//               <div ref={logo5Ref} style={{ opacity: 0 }}>
//                 <img src="/logo-5.svg" alt="Retrorika" className="w-40 h-auto sm:w-52 md:w-64 xl:w-96 object-contain" loading="eager" />
//               </div>
//             </>
//           )}
//         </div>

//         {/* PHASE 2-3: Assembled logo - stacked layers */}
//         <div 
//           className={`absolute ${isMobile ? 'w-48 h-48' : 'w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96'}`}
//           style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
//         >
//           <div ref={layer0Ref} className="absolute inset-0 flex items-center justify-center z-10" style={{ opacity: 0 }}>
//             <img src="/logo-6.svg" alt="Hexagon Border" className="w-full h-full object-contain" />
//           </div>
//           <div ref={layer1Ref} className="absolute inset-0 flex items-center justify-center z-20" style={{ opacity: 0 }}>
//             <img src="/logo-7.svg" alt="Black Fill" className="w-full h-full object-contain" />
//           </div>
//           <div ref={layer2Ref} className="absolute inset-0 flex items-center justify-center z-30" style={{ opacity: 0 }}>
//             <img src="/logo-1.svg" alt="Mountain" className="w-full h-full object-contain" />
//           </div>
//           <div ref={layer3Ref} className="absolute inset-0 flex items-center justify-center z-40" style={{ opacity: 0 }}>
//             <img src="/logo-2.svg" alt="Tree" className="w-full h-full object-contain" />
//           </div>
//           <div ref={layer4Ref} className="absolute inset-0 flex items-center justify-center z-60" style={{ opacity: 0 }}>
//             <img src="/logo-5.svg" alt="Retrorika" className="w-full h-full object-contain" />
//           </div>
//           <div ref={layer5Ref} className="absolute inset-0 flex items-center justify-center z-[55]" style={{ opacity: 0 }}>
//             <img src="/logo-4.svg" alt="Forest" className="w-full h-full object-contain" />
//           </div>
//           <div ref={layer6Ref} className="absolute inset-0 flex items-center justify-center z-[60]" style={{ opacity: 0 }}>
//             <img src="/logo-3.svg" alt="Sparrow" className="w-full h-full object-contain" />
//           </div>
//         </div>

//         {/* PHASE 3-4: Full logo */}
//         <div 
//           ref={fullLogoRef}
//           className="absolute flex flex-col items-center justify-center pointer-events-none"
//           style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0 }}
//         >
//           <img 
//             src="/logo-full.webp" 
//             alt="Retrorika Full Logo" 
//             className={`object-contain ${isMobile ? 'w-48 h-auto' : 'w-56 h-auto sm:w-64 md:w-72 lg:w-80 xl:w-96'}`}
//           />
//         </div>

//         {/* PHASE 5: Text reveal */}
//         <div 
//           className={`absolute flex flex-col items-center text-center px-4 sm:px-6 ${isMobile ? 'max-w-xs' : 'max-w-2xl'}`}
//           style={{ 
//             top: isMobile ? "58%" : "58%", 
//             left: "50%", 
//             transform: "translateX(-50%)"
//           }}
//         >
//           <p ref={textLine1Ref} className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-light leading-relaxed text-gray-500 tracking-wide mb-1" style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
//             Retrorika adalah satu-satunya
//           </p>
//           <p ref={textLine2Ref} className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-light leading-relaxed text-gray-500 tracking-wide mb-1" style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
//             resto yang menerapkan prinsip
//           </p>
          
//           {isMobile ? (
//             <>
//               <p ref={textLine3Ref} className="text-base font-medium leading-relaxed text-gray-700 tracking-widest mb-0.5" style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
//                 less waste
//               </p>
//               <p ref={textLine4Ref} className="text-base font-medium leading-relaxed text-gray-700 tracking-widest mb-2" style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
//                 low carbon
//               </p>
//             </>
//           ) : (
//             <p ref={textLine3Ref} className="text-base sm:text-lg md:text-2xl lg:text-2xl xl:text-3xl font-medium leading-relaxed text-gray-700 tracking-widest mb-3" style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
//               less waste · low carbon
//             </p>
//           )}
          
//           <p ref={textLine5Ref} className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-light leading-relaxed text-gray-500 tracking-wide" style={{ fontFamily: "'Playfair Display', serif", opacity: 0 }}>
//             di Indonesia
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
