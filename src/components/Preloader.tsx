import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

// List of all critical assets to preload
const ASSETS_TO_PRELOAD = [
  "/kapucinobaru.jpg.webp",
  "/kapucinobaru-potong.webp",
  "/var2.webp",
  "/crop2.webp",
  "/logo-full.webp",
  "/logo-1.svg",
  "/logo-2.svg",
  "/logo-3.svg",
  "/logo-4.svg",
  "/logo-5.svg",
  "/logo-6.svg",
  "/logo-7.svg",
  "/favicon.png",
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Don't fail on error, just continue
      img.src = src;
    });
  }, []);

  const preloadWebGL = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      // Create temporary canvas to warm up WebGL context
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      
      try {
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
          // Compile a simple shader to warm up the GPU
          const vertexShader = (gl as WebGLRenderingContext).createShader((gl as WebGLRenderingContext).VERTEX_SHADER);
          const fragmentShader = (gl as WebGLRenderingContext).createShader((gl as WebGLRenderingContext).FRAGMENT_SHADER);
          
          if (vertexShader && fragmentShader) {
            (gl as WebGLRenderingContext).shaderSource(vertexShader, "void main() { gl_Position = vec4(0.0); }");
            (gl as WebGLRenderingContext).shaderSource(fragmentShader, "void main() { gl_FragColor = vec4(0.0); }");
            (gl as WebGLRenderingContext).compileShader(vertexShader);
            (gl as WebGLRenderingContext).compileShader(fragmentShader);
            
            // Clean up
            (gl as WebGLRenderingContext).deleteShader(vertexShader);
            (gl as WebGLRenderingContext).deleteShader(fragmentShader);
          }
        }
      } catch (e) {
        // WebGL not available, continue anyway
      }
      
      resolve();
    });
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      const totalAssets = ASSETS_TO_PRELOAD.length + 1; // +1 for WebGL warmup
      let loaded = 0;

      // Preload WebGL first
      await preloadWebGL();
      loaded++;
      setProgress(Math.round((loaded / totalAssets) * 100));

      // Preload images in parallel batches of 3 for mobile
      const batchSize = 3;
      for (let i = 0; i < ASSETS_TO_PRELOAD.length; i += batchSize) {
        const batch = ASSETS_TO_PRELOAD.slice(i, i + batchSize);
        await Promise.all(batch.map(preloadImage));
        loaded += batch.length;
        setProgress(Math.round((loaded / totalAssets) * 100));
      }

      // Small delay to ensure smooth transition
      await new Promise((r) => setTimeout(r, 500));
      setIsComplete(true);
      
      // Wait for exit animation
      setTimeout(onComplete, 1200);
    };

    loadAssets();
  }, [preloadImage, preloadWebGL, onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
          }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Decorative circles */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/3"
              animate={{ 
                scale: [1, 0.8, 1],
                rotate: [360, 180, 0],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* Logo with stagger reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="mb-16 relative z-10"
          >
            <motion.span 
              className="text-white text-3xl md:text-4xl tracking-[0.4em] font-light block"
              style={{ fontFamily: "'Cinzel', serif" }}
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            >
              RETRORIKA
            </motion.span>
            <motion.div
              className="w-12 h-px bg-white/30 mx-auto mt-4"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
            />
          </motion.div>

          {/* Custom progress indicator */}
          <div className="relative z-10 w-64 md:w-80">
            {/* Progress track */}
            <div className="h-[1px] bg-white/10 relative">
              {/* Animated progress line */}
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-transparent via-white to-transparent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              />
              {/* Glowing dot at progress end */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                initial={{ left: 0 }}
                animate={{ left: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              />
            </div>
            
            {/* Progress counter */}
            <div className="flex justify-between items-center mt-6">
              <motion.p
                className="text-white/40 text-xs tracking-[0.2em] font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                MEMUAT
              </motion.p>
              <motion.p
                className="text-white/60 text-xs tracking-[0.3em] font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {String(progress).padStart(2, '0')}%
              </motion.p>
            </div>
          </div>

          {/* Subtle grain texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
