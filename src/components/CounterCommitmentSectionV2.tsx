import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import WordReveal from "./WordReveal";

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

export default function CounterCommitmentSectionV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    animationId: number;
  } | null>(null);
  
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
      // Hide leaves on mobile AND tablet (< 1024px / lg breakpoint)
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = isInView.scrollYProgress.on("change", (v) => {
      setShouldCount(v > 0.1);
    });
    return unsubscribe;
  }, [isInView.scrollYProgress]);

  const count = useReplayCountUp(1456498, 1.5, shouldCount);

  // Phase 1: Counter text fades out and scales down
  const contentOpacity = useTransform(scrollYProgress, [0.18, 0.26], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0.18, 0.26], [1, 0.8]);

  // Phase 2: Background image fades in with zoom effect
  const bgOpacity = useTransform(scrollYProgress, [0.24, 0.36], [0, 1]);
  const bgScale = useTransform(scrollYProgress, [0.24, 0.50], [1.2, 1]);
  const bgY = useTransform(scrollYProgress, [0.50, 1], ["0%", "-15%"]);

  // Phase 3: Leaves PNG appears WITH background (same timing, instant opacity)
  const leavesOpacity = bgOpacity; // Same as background - instant sync
  
  // Leaves move up slowly following dissolve effect
  const leavesY = useTransform(scrollYProgress, (v: number) => {
    const startPos = isMobile ? "20%" : "15%"; // Mobile starts lower
    const startPosNum = isMobile ? 20 : 15;
    
    if (v < 0.24) return startPos; // Start position (slightly below)
    if (v < 0.42) {
      // Move up to center
      const progress = (v - 0.24) / (0.42 - 0.24);
      return `${startPosNum - progress * startPosNum}%`;
    }
    if (v < 0.50) return "0%";
    if (v < 0.70) {
      // Gentle parallax before dissolve
      const parallaxProgress = (v - 0.50) / (0.70 - 0.50);
      return `${-parallaxProgress * 15}%`;
    }
    // Move up with dissolve and continue moving (0.70 - 1.0)
    // This will continue into LogoRetorika section
    const dissolveProgress = (v - 0.70) / (1.0 - 0.70);
    // Move from -15% to -200% (continues moving up beyond screen)
    return `${-15 - dissolveProgress * 185}%`;
  });

  // Phase 4: Text "komitmen kami" appears
  const textOpacity = useTransform(scrollYProgress, [0.48, 0.60], [0, 1]);

  // Three.js shader setup for dissolve effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uProgress;
      uniform vec2 uResolution;
      uniform vec3 uColor;
      uniform float uSpread;
      varying vec2 vUv;

      float Hash(vec2 p) {
        vec3 p2 = vec3(p.xy, 1.0);
        return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
      }

      float noise(in vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f *= f * (3.0 - 2.0 * f);
        return mix(
          mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
          mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        v += noise(p * 1.0) * 0.5;
        v += noise(p * 2.0) * 0.25;
        v += noise(p * 4.0) * 0.125;
        return v;
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
        
        // Dissolve from bottom to top, covering entire screen
        float dissolveEdge = uv.y - uProgress * 1.8; // Increased to 1.8 for full top coverage
        float noiseValue = fbm(centeredUv * 15.0);
        float d = dissolveEdge + noiseValue * uSpread;
        
        // Sharp edge without blur using step function
        float alpha = step(0.0, d);
        alpha = 1.0 - alpha;
        
        // Use beige/cream color for dissolve to match LogoRetorikaSectionV2
        vec3 dissolveColor = vec3(0.976, 0.969, 0.957); // #f9f7f4
        gl_FragColor = vec4(dissolveColor, alpha);
      }
    `;

    if (sceneRef.current) {
      cancelAnimationFrame(sceneRef.current.animationId);
      sceneRef.current.renderer.dispose();
      sceneRef.current.material.dispose();
      sceneRef.current = null;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        precision: "lowp",
        stencil: false,
        depth: false,
      });
    } catch (e) {
      console.warn("WebGL not available, dissolve effect disabled");
      return;
    }

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uColor: { value: new THREE.Vector3(0.976, 0.969, 0.957) }, // #f9f7f4 beige
        uSpread: { value: 0.3 }, // Reduced spread for sharper edge
      },
      transparent: true,
    });

    const resize = () => {
      if (!containerRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(width, height);
    };

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    resize();
    window.addEventListener("resize", resize, { passive: true });

    sceneRef.current = { scene, camera, renderer, material, animationId: 0 };
    renderer.render(scene, camera);

    return () => {
      window.removeEventListener("resize", resize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Render loop control
  const isDissolveActive = useRef(false);
  const renderLoopId = useRef<number>(0);

  useEffect(() => {
    const startRenderLoop = () => {
      if (!sceneRef.current || isDissolveActive.current) return;
      
      isDissolveActive.current = true;
      
      const render = () => {
        if (sceneRef.current && isDissolveActive.current) {
          sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
          renderLoopId.current = requestAnimationFrame(render);
        }
      };
      
      render();
    };

    const stopRenderLoop = () => {
      isDissolveActive.current = false;
      cancelAnimationFrame(renderLoopId.current);
      
      if (sceneRef.current) {
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      }
    };

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (sceneRef.current) {
        const dissolveStart = 0.6666;
        const dissolveEnd = 1.0; // Dissolve completes at 100% to cover entire section
        const normalizedProgress = Math.max(0, Math.min(1, (latest - dissolveStart) / (dissolveEnd - dissolveStart)));
        sceneRef.current.material.uniforms.uProgress.value = normalizedProgress;
        
        if (normalizedProgress > 0 && normalizedProgress < 1) {
          startRenderLoop();
        } else {
          stopRenderLoop();
        }
      }
    });

    return () => {
      unsubscribe();
      stopRenderLoop();
    };
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} style={{ height: "800vh", marginTop: "-121vh" }} className="relative z-10">
      
      {/* Separate container for leaves - hidden on mobile & tablet (< 1024px) */}
      <div className="fixed inset-0 pointer-events-none hidden lg:block" style={{ zIndex: 100 }}>
        <motion.div
          className="absolute overflow-visible"
          style={{ 
            top: isMobile ? "45%" : "35%",
            bottom: isMobile ? "-10%" : "-15%",
            left: "0",
            right: "0",
            opacity: leavesOpacity,
            y: leavesY,
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
        </motion.div>
      </div>

      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ 
          height: "100dvh",
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
        }}
      >

        {/* Phase 1: White background with counter */}
        <section
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black"
        >
          <motion.div 
            className="text-center px-8" 
            style={{ 
              marginTop: "1vh",
              opacity: contentOpacity,
              scale: contentScale,
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

        {/* Phase 2: Background image with zoom effect */}
        <motion.div
          className="absolute inset-x-0 overflow-hidden z-[3]"
          style={{ 
            top: "-15%", 
            bottom: "-15%", 
            opacity: bgOpacity,
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
          }}
        >
          <motion.div
            className="w-full h-full"
            style={{
              scale: bgScale,
              y: bgY,
            }}
          >
            <img
              src="/bgv2.webp"
              alt="Retro Background"
              className="w-full h-full object-cover"
              style={{ 
                objectPosition: "center center",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </motion.div>

        {/* Phase 4: Text "komitmen kami" appears - MOBILE */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-[15] pointer-events-none px-6 sm:hidden"
          style={{ opacity: textOpacity, marginTop: "-50vh" }}
        >
          <div className="text-center max-w-xs">
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white mb-1"
              delay={0}
              scrollProgress={scrollYProgress}
              startProgress={0.48}
              endProgress={0.66}
            >
              Ini adalah
            </WordReveal>
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white mb-1"
              delay={0.015}
              scrollProgress={scrollYProgress}
              startProgress={0.48}
              endProgress={0.66}
            >
              komitmen kami
            </WordReveal>
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white mb-1"
              delay={0.03}
              scrollProgress={scrollYProgress}
              startProgress={0.48}
              endProgress={0.66}
            >
              menyajikan resep
            </WordReveal>
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white mb-1"
              delay={0.08}
              scrollProgress={scrollYProgress}
              startProgress={0.48}
              endProgress={0.66}
            >
              terbaik sambil
            </WordReveal>
            <WordReveal
              className="text-xl font-light leading-relaxed tracking-wide text-white"
              delay={0.10}
              scrollProgress={scrollYProgress}
              startProgress={0.48}
              endProgress={0.66}
            >
              merawat ibu bumi
            </WordReveal>
          </div>
        </motion.div>

        {/* Phase 4: Text "komitmen kami" appears - DESKTOP */}
        <motion.div
          className="absolute inset-0 hidden sm:flex items-center justify-center z-[15] pointer-events-none px-6"
          style={{ opacity: textOpacity, marginTop: "-45vh" }}
        >
          <div className="text-center max-w-xl">
            <WordReveal
              className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed tracking-wide text-white mb-2"
              delay={0}
              scrollProgress={scrollYProgress}
              startProgress={0.48}
              endProgress={0.66}
            >
              Ini adalah komitmen kami
            </WordReveal>
            <WordReveal
              className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed tracking-wide text-white mb-2"
              delay={0.015}
              scrollProgress={scrollYProgress}
              startProgress={0.48}
              endProgress={0.66}
            >
              menyajikan resep terbaik
            </WordReveal>
            <WordReveal
              className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed tracking-wide text-white"
              delay={0.03}
              scrollProgress={scrollYProgress}
              startProgress={0.48}
              endProgress={0.66}
            >
              sambil merawat ibu bumi
            </WordReveal>
          </div>
        </motion.div>

        {/* Phase 5: Three.js Canvas for organic dissolve effect */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[25] pointer-events-none"
          style={{ 
            width: "100%", 
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
