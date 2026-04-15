import { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Header from "../src/components/Header";

function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    let rotation = 0;
    const stars: { x: number; y: number; r: number; opacity: number }[] = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * 1200,
        y: Math.random() * 900,
        r: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
      });

      const cx = W / 2;
      const cy = H / 2 - 60;
      const R = Math.min(W, H) * 0.2;

      const grad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
      grad.addColorStop(0, "rgba(160,190,220,0.95)");
      grad.addColorStop(0.6, "rgba(100,140,180,0.85)");
      grad.addColorStop(1, "rgba(40,60,100,0.7)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      const latCount = 8;
      for (let i = 1; i < latCount; i++) {
        const lat = (i / latCount) * Math.PI - Math.PI / 2;
        const ry = Math.cos(lat) * R;
        const y = cy + Math.sin(lat) * R;
        ctx.beginPath();
        ctx.ellipse(cx, y, ry, Math.abs(ry * 0.2), 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      const lonCount = 10;
      for (let i = 0; i < lonCount; i++) {
        const angle = (i / lonCount) * Math.PI * 2 + rotation;
        const x = cx + Math.sin(angle) * R * 0.5;
        ctx.beginPath();
        ctx.ellipse(x, cy, Math.abs(Math.cos(angle)) * R, R, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.restore();

      const highlight = ctx.createRadialGradient(
        cx - R * 0.35,
        cy - R * 0.35,
        0,
        cx - R * 0.35,
        cy - R * 0.35,
        R * 0.7
      );
      highlight.addColorStop(0, "rgba(255,255,255,0.2)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      rotation += 0.005;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

export default function GlobeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-15%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "linear-gradient(160deg, #06111e 0%, #0d2040 50%, #06111e 100%)" }}
    >
      <Header />
      <GlobeCanvas />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          className="text-center text-white mt-80 md:mt-96"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <p
            className="text-lg md:text-xl font-light tracking-wide leading-relaxed text-gray-200 max-w-sm mx-auto px-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Mengurangi jejak karbon dengan
            <br />
            membeli hasil bumi setempat
          </p>
        </motion.div>
      </div>
    </section>
  );
}
