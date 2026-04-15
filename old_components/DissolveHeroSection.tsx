// import { useRef, useEffect } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import * as THREE from "three";
// import WordReveal from "./WordReveal";

// export default function HeroSection() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const sceneRef = useRef<{
//     scene: THREE.Scene;
//     camera: THREE.OrthographicCamera;
//     renderer: THREE.WebGLRenderer;
//     material: THREE.ShaderMaterial;
//     animationId: number;
//   } | null>(null);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   const textY = useTransform(scrollYProgress, [0, 0.25], ["20vh", "0vh"]);
//   const textOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

//   const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

//   const heroSlideUp = useTransform(scrollYProgress, [0.6, 1], ["0%", "-60%"]);
//   const heroOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const vertexShader = `
//       varying vec2 vUv;
//       void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
//     `;

//     const fragmentShader = `
//       uniform float uProgress;
//       uniform vec2 uResolution;
//       uniform vec3 uColor;
//       uniform float uSpread;
//       varying vec2 vUv;

//       float Hash(vec2 p) {
//         vec3 p2 = vec3(p.xy, 1.0);
//         return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
//       }

//       float noise(in vec2 p) {
//         vec2 i = floor(p);
//         vec2 f = fract(p);
//         f *= f * (3.0 - 2.0 * f);
//         return mix(
//           mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
//           mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
//           f.y
//         );
//       }

//       float fbm(vec2 p) {
//         float v = 0.0;
//         v += noise(p * 1.0) * 0.5;
//         v += noise(p * 2.0) * 0.25;
//         v += noise(p * 4.0) * 0.125;
//         return v;
//   }

//   void main() {
//   vec2 uv = vUv;
//   float aspect = uResolution.x / uResolution.y;
//   vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);

//   float dissolveEdge = uv.y - uProgress * 1.2;
//   float noiseValue - fbm(centeredUv * 15.0);
//   float d = dissloveEdge + noiseValue * uSpread;

//   float pixelSize = 1.0 / uResolution.y;
//   float alpha = 1.0 - smoothstep(-pixel size pixelSize, d);

//   gl_FragColor = vec4(uColor, alpha);
//   }

//     `;

//     if (sceneRef.current) {
//       cancelAnimationFrame(sceneRef.current.animationId);
//       sceneRef.current.renderer.dispose();
//       sceneRef.current.material.dispose();
//       sceneRef.current = null;
//     }

//     const scene = new THREE.Scene();
//     const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
//     let renderer: THREE.WebGLRenderer;
//     try {
//       renderer = new THREE.WebGLRenderer({
//         canvas: canvasRef.current,
//         alpha: true,
//         antialias: false,
//         powerPreference: "low-power",
//       });
//     } catch (e) {
//       console.warn("WebGL not available, dissolve effect disabled");
//       return;
//     }

//     const geometry = new THREE.PlaneGeometry(2, 2);
//     const material = new THREE.ShaderMaterial({
//       vertexShader,
//       fragmentShader,
//       uniforms: {
//         uProgress: { value: 0 },
//         uResolution: {
//           value: new THREE.Vector2(window.innerWidth, window.innerHeight),
//         },
//         uColor: { value: new THREE.Vector3(1, 1, 1) }, // white
//         uSpread: { value: 0.5 },
//       },
//       transparent: true,
//     });

//     const resize = () => {
//       if (!containerRef.current) return;
//       const width = window.innerWidth;
//       const height = window.innerHeight;
//       renderer.setSize(width, height);
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//       material.uniforms.uResolution.value.set(width, height);
//     };

//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     resize();
//     window.addEventListener("resize", resize);

//     let animationId: number;
//     const animate = () => {
//       renderer.render(scene, camera);
//       animationId = requestAnimationFrame(animate);
//       sceneRef.current = { scene, camera, renderer, material, animationId };
//     };

//     animate();

//     return () => {
//       window.removeEventListener("resize", resize);
//       cancelAnimationFrame(animationId);
//       renderer.dispose();
//       material.dispose();
//       geometry.dispose();
//       sceneRef.current = null;
//     };
//   }, []);

//   // Update shader progress based on scroll
//   useEffect(() => {
//     const unsubscribe = scrollYProgress.on("change", (latest) => {
//       if (sceneRef.current) {
//         // Map scroll progress to shader dissolve (starts at 40% scroll, ends at 95%)
//         const dissolveStart = 0.4;
//         const dissolveEnd = 0.95;
//         const normalizedProgress = Math.max(0, Math.min(1, (latest - dissolveStart) / (dissolveEnd - dissolveStart)));
//         sceneRef.current.material.uniforms.uProgress.value = normalizedProgress;
//       }
//     });

//     return () => unsubscribe();
//   }, [scrollYProgress]);

//   return (
//     <div ref={containerRef} style={{ height: "250vh", marginBottom: "-1vh"}} className="relative z-20">
//       <motion.div
//         className="sticky top-0 w-full overflow-hidden"
//         style={{ height: "100dvh", opacity: heroOpacity, y: heroSlideUp }}
//       >
//         {/* Background photo - static, no movement */}
//         <div className="absolute inset-0">
//           <img
//             src="/kapucinobaru.jpg.jpeg"
//             alt="Cappucino"
//             className="w-full h-full object-cover"
//             style={{ objectPosition: "center 55%" }}
//           />
//           <div className="absolute inset-0 bg-black/50" />
//         </div>

//         {/* Coffee cup cutout - MOBILE version (< 768px) */}
//         <div 
//           className="absolute z-15 pointer-events-none md:hidden"
//           style={{
//             left: "50%",
//             transform: "translateX(-50%)",
//             /* === MOBILE SETTINGS === */
//             top: "-125%",      /* Adjust vertical position */
//             width: "350%",    /* Adjust width */
//             height: "350%",   /* Adjust height */
//           }}
//         >
//           <img
//             src="/kapucinobaru-potong.png"
//             alt="Coffee Cup"
//             className="w-full h-full object-contain"
//           />
//         </div>

//         {/* Coffee cup cutout - TABLET version (768px - 1024px) */}
//         <div 
//           className="absolute z-15 pointer-events-none hidden md:block lg:hidden"
//           style={{
//             left: "50%",
//             transform: "translateX(-50%)",
//             /* === TABLET SETTINGS === */
//             top: "-80%",       /* Adjust vertical position */
//             width: "250%",     /* Adjust width */
//             height: "250%",    /* Adjust height */
//           }}
//         >
//           <img
//             src="/kapucinobaru-potong.png"
//             alt="Coffee Cup"
//             className="w-full h-full object-contain"
//           />
//         </div>

//         {/* Coffee cup cutout - DESKTOP version (>= 1024px) */}
//         <div 
//           className="absolute z-15 pointer-events-none hidden lg:block"
//           style={{
//             left: "50%",
//             transform: "translateX(-50%)",
//             /* === DESKTOP SETTINGS === */
//             top: "-22%",      /* Adjust vertical position */
//             width: "140%",    /* Adjust width */
//             height: "140%",   /* Adjust height */
//           }}
//         >
//           <img
//             src="/kapucinobaru-potong.png"
//             alt="Coffee Cup"
//             className="w-full h-full object-contain"
//           />
//         </div>

//         {/* Three.js Canvas for organic dissolve effect */}
//         <canvas
//           ref={canvasRef}
//           className="absolute inset-0 z-20 pointer-events-none"
//           style={{ width: "100%", height: "100%" }}
//         />


//         {/* Hero text — MOBILE version */}
//         <motion.div
//           className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center px-6 md:hidden"
//           style={{ 
//             opacity: textOpacity, 
//             y: textY,
//           }}
//         >
//           <div className="text-center w-full max-w-xs" style={{ marginTop: "-40vh" }}>
//             <WordReveal 
//               className="hero-font text-4xl sm:text-5xl font-light leading-tight text-white mb-1"
//               delay={0}
//               scrollProgress={scrollYProgress}
//               startProgress={0.02}
//               endProgress={0.15}
//             >
//               This is not
//             </WordReveal>
//             <WordReveal 
//               className="hero-font text-4xl sm:text-5xl font-light leading-tight text-white mb-1"
//               delay={0.02}
//               scrollProgress={scrollYProgress}
//               startProgress={0.02}
//               endProgress={0.15}
//             >
//               just
//             </WordReveal>
//             <WordReveal 
//               className="hero-font text-4xl sm:text-5xl font-light leading-tight text-white"
//               delay={0.04}
//               scrollProgress={scrollYProgress}
//               startProgress={0.02}
//               endProgress={0.15}
//             >
//               Coffee
//             </WordReveal>
//           </div>
//         </motion.div>

//         {/* Hero text — DESKTOP version */}
//         <motion.div
//           className="absolute inset-0 z-10 pointer-events-none hidden md:flex items-center justify-center px-6"
//           style={{ 
//             opacity: textOpacity, 
//             y: textY,
//           }}
//         >
//           <div className="text-center w-full max-w-2xl" style={{ marginTop: "-50vh" }}>
//             <WordReveal 
//               className="hero-font text-6xl lg:text-7xl font-light leading-tight text-white mb-1"
//               delay={0}
//               scrollProgress={scrollYProgress}
//               startProgress={0.02}
//               endProgress={0.15}
//             >
//               This is not
//             </WordReveal>
//             <WordReveal 
//               className="hero-font text-6xl lg:text-7xl font-light leading-tight text-white mb-1"
//               delay={0.02}
//               scrollProgress={scrollYProgress}
//               startProgress={0.02}
//               endProgress={0.15}
//             >
//               just
//             </WordReveal>
//             <WordReveal 
//               className="hero-font text-6xl lg:text-7xl font-light leading-tight text-white"
//               delay={0.04}
//               scrollProgress={scrollYProgress}
//               startProgress={0.02}
//               endProgress={0.15}
//             >
//               Coffee
//             </WordReveal>
//           </div>
//         </motion.div>

//         {/* Scroll hint */}
//         <motion.div
//           className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
//           style={{ opacity: hintOpacity }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1.8, duration: 0.8 }}
//         >
//           <span
//             className="text-white/50 text-[10px] tracking-[0.3em] uppercase"
//             style={{ fontFamily: "'Cinzel', serif" }}
//           >
//             scroll
//           </span>
//           <motion.div
//             className="w-px h-8 bg-white/30"
//             animate={{ scaleY: [0, 1, 0] }}
//             transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
//           />
//         </motion.div>

//       </motion.div>
//     </div>
//   );
// }
