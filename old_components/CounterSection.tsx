import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

export default function CounterSection() {
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

  useEffect(() => {
    const unsubscribe = isInView.scrollYProgress.on("change", (v) => {
      setShouldCount(v > 0.1);
    });
    return unsubscribe;
  }, [isInView.scrollYProgress]);

  const count = useReplayCountUp(1456498, 2.5, shouldCount);

  // Text and number pushed to the right by crop PNG
  const contentX = useTransform(scrollYProgress, [0.65, 0.85], ["0%", "100%"]);
  const contentOpacity = useTransform(scrollYProgress, [0.65, 0.8], [1, 0]);

  // Crop PNG slides in from left
  const cropX = useTransform(scrollYProgress, [0.65, 0.85], ["-100%", "0%"]);
  const cropOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);

  // Black background overlay
  const bgOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  return (
    <div ref={containerRef} style={{ height: "250vh" }} className="relative">
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* White background section */}
        <section
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black light-section"
        >
          <motion.div 
            className="text-center px-8" 
            style={{ 
              marginTop: "-8vh",
              x: contentX,
              opacity: contentOpacity
            }}
          >
            <motion.p
              className="text-sm md:text-base tracking-widest text-gray-400 mb-8 font-light uppercase"
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

        {/* Crop PNG slides in from left, pushing content */}
        <motion.div
          className="absolute z-10 overflow-hidden"
          style={{ 
            x: cropX,
            opacity: cropOpacity,
            top: "-12%",
            bottom: "-12%",
            left: 0,
            right: 0,
          }}
        >
          <img
            src="/nasi-campur-crop.png"
            alt="Nasi Campur Crop"
            className="w-full h-full object-cover sm:object-contain md:object-cover"
            style={{ 
              objectPosition: "center 30%",
              transform: "scale(1.2)",
            }}
          />
        </motion.div>

        {/* Dark overlay behind PNG */}
        <motion.div
          className="absolute inset-0 z-[5] bg-black"
          style={{ opacity: bgOpacity }}
        />
      </div>
    </div>
  );
}
