import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "../src/components/Header";

const JAVA_POINTS: [number, number][] = [
  [0.0, 0.5], [0.05, 0.38], [0.1, 0.32], [0.16, 0.27],
  [0.23, 0.24], [0.30, 0.22], [0.38, 0.21], [0.45, 0.23],
  [0.52, 0.26], [0.58, 0.29], [0.63, 0.28], [0.68, 0.26],
  [0.73, 0.28], [0.77, 0.33], [0.80, 0.40], [0.78, 0.48],
  [0.72, 0.55], [0.64, 0.59], [0.55, 0.60], [0.46, 0.57],
  [0.38, 0.59], [0.29, 0.61], [0.20, 0.60], [0.12, 0.57],
  [0.05, 0.55], [0.01, 0.52], [0.0, 0.5],
];

const SUMATRA_POINTS: [number, number][] = [
  [0.0, 0.28], [0.04, 0.18], [0.09, 0.12], [0.14, 0.09],
  [0.19, 0.08], [0.24, 0.11], [0.27, 0.18], [0.24, 0.26],
  [0.21, 0.34], [0.23, 0.43], [0.26, 0.51], [0.23, 0.58],
  [0.17, 0.62], [0.10, 0.60], [0.05, 0.55], [0.01, 0.47],
  [0.0, 0.38], [0.0, 0.28],
];

const BORNEO_POINTS: [number, number][] = [
  [0.35, 0.1], [0.42, 0.08], [0.5, 0.1], [0.55, 0.18],
  [0.57, 0.28], [0.54, 0.38], [0.48, 0.45], [0.40, 0.48],
  [0.32, 0.45], [0.27, 0.37], [0.26, 0.27], [0.30, 0.18],
  [0.35, 0.1],
];

const SULAWESI_POINTS: [number, number][] = [
  [0.62, 0.12], [0.66, 0.1], [0.70, 0.14], [0.68, 0.22],
  [0.64, 0.3], [0.67, 0.38], [0.71, 0.44], [0.68, 0.50],
  [0.63, 0.46], [0.60, 0.38], [0.58, 0.28], [0.61, 0.18],
  [0.62, 0.12],
];

interface IslandDef {
  pts: [number, number][];
  ox: number;
  oy: number;
  sx: number;
  sy: number;
}

const ISLAND_CONFIGS: IslandDef[] = [
  { pts: SUMATRA_POINTS, ox: 0.02, oy: 0.25, sx: 0.22, sy: 0.5 },
  { pts: BORNEO_POINTS, ox: 0.25, oy: 0.04, sx: 0.32, sy: 0.5 },
  { pts: JAVA_POINTS, ox: 0.28, oy: 0.55, sx: 0.54, sy: 0.28 },
  { pts: SULAWESI_POINTS, ox: 0.6, oy: 0.05, sx: 0.15, sy: 0.5 },
];

interface Location {
  x: number;
  y: number;
  label: string;
}

const LOCATIONS: Location[] = [
  { x: 0.52, y: 0.66, label: "Retrorika" },
  { x: 0.44, y: 0.60, label: "Kebun Kopi" },
  { x: 0.60, y: 0.70, label: "Pertanian" },
];

function drawIsland(
  ctx: CanvasRenderingContext2D,
  island: IslandDef,
  mapX: number,
  mapY: number,
  mapW: number,
  mapH: number,
  fillColor: string,
  shadowIntensity: number = 0
) {
  const pts = island.pts.map(([nx, ny]) => [
    mapX + (island.ox + nx * island.sx) * mapW,
    mapY + (island.oy + ny * island.sy) * mapH,
  ]);

  ctx.beginPath();
  pts.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();

  if (shadowIntensity > 0) {
    ctx.shadowColor = `rgba(0,0,0,${shadowIntensity * 0.5})`;
    ctx.shadowBlur = shadowIntensity * 20;
    ctx.shadowOffsetY = shadowIntensity * 8;
  }
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
}

function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const animRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const getScrollProgress = useCallback(() => {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    const totalScroll = el.offsetHeight - viewH;
    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / totalScroll));
  }, []);

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

    const stars: { x: number; y: number; r: number; op: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.2, op: Math.random() * 0.5 + 0.1 });
    }

    let time = 0;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      time += 0.016;
      ctx.clearRect(0, 0, W, H);

      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.op})`;
        ctx.fill();
      });

      const p = scrollRef.current;

      const mapScale = 0.25 + p * 0.75;
      const mapW = W * 0.85 * mapScale;
      const mapH = H * 0.65 * mapScale;
      const mapX = (W - mapW) / 2;
      const mapY = (H - mapH) / 2 + (1 - mapScale) * H * 0.1;

      const elevation = Math.max(0, (p - 0.45) / 0.4);
      const islandColor = elevation > 0
        ? `rgb(${Math.round(45 - elevation * 20)},${Math.round(106 - elevation * 30)},${Math.round(79 - elevation * 25)})`
        : "#2d6a4f";

      const mapOpacity = Math.min(1, p / 0.15);
      ctx.globalAlpha = mapOpacity;

      ISLAND_CONFIGS.forEach((island) => {
        if (elevation > 0.1) {
          drawIsland(ctx, island, mapX, mapY + elevation * 6, mapW, mapH, "rgba(0,0,0,0.3)", 0);
        }
        drawIsland(ctx, island, mapX, mapY, mapW, mapH, islandColor, elevation);

        if (elevation > 0.05) {
          const pts = island.pts.map(([nx, ny]) => [
            mapX + (island.ox + nx * island.sx) * mapW,
            mapY + (island.oy + ny * island.sy) * mapH,
          ]);
          ctx.beginPath();
          pts.forEach(([x, y], i) => {
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.strokeStyle = `rgba(80,160,100,${elevation * 0.6})`;
          ctx.lineWidth = elevation * 2;
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;

      if (p > 0.28) {
        const dotAlpha = Math.min(1, (p - 0.28) / 0.12);
        LOCATIONS.forEach((loc, i) => {
          const pulse = 0.5 + Math.sin(time * 2.5 + i * 1.2) * 0.5;
          const lx = mapX + loc.x * mapW;
          const ly = mapY + loc.y * mapH;

          ctx.beginPath();
          ctx.arc(lx, ly, 14 + pulse * 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,80,50,${dotAlpha * 0.15 * pulse})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(lx, ly, 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,60,30,${dotAlpha})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(lx, ly, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,200,180,${dotAlpha})`;
          ctx.fill();
        });

        if (p > 0.32) {
          const lineAlpha = Math.min(1, (p - 0.32) / 0.1) * dotAlpha;
          const loc = LOCATIONS[0];
          const lx = mapX + loc.x * mapW;
          const ly = mapY + loc.y * mapH;
          ctx.beginPath();
          ctx.moveTo(lx, ly - 8);
          ctx.lineTo(lx, ly - 40);
          ctx.strokeStyle = `rgba(255,255,255,${lineAlpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      if (p > 0.75) {
        const rotAlpha = Math.min(1, (p - 0.75) / 0.15);
        ctx.globalAlpha = rotAlpha * 0.9;

        const cx = W * 0.5;
        const cy = H * 0.5;
        const rotAngle = (p - 0.75) * Math.PI * 0.5;

        const nextLoc = LOCATIONS[1];
        const nx = mapX + nextLoc.x * mapW - cx;
        const ny = mapY + nextLoc.y * mapH - cy;
        const destX = cx + Math.cos(rotAngle) * nx - Math.sin(rotAngle) * ny;
        const destY = cy + Math.sin(rotAngle) * nx + Math.cos(rotAngle) * ny;

        ctx.beginPath();
        ctx.arc(destX, destY, 6 + Math.sin(time * 3) * 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(80,200,120,0.9)";
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const onScroll = () => {
      scrollRef.current = getScrollProgress();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [getScrollProgress]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default function IndonesiaMapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const textOpacity1 = useTransform(scrollYProgress, [0.05, 0.2, 0.38, 0.45], [0, 1, 1, 0]);
  const textOpacity2 = useTransform(scrollYProgress, [0.4, 0.52, 0.68, 0.78], [0, 1, 1, 0]);
  const textOpacity3 = useTransform(scrollYProgress, [0.72, 0.82, 0.95, 1.0], [0, 1, 1, 0.4]);
  const text3Y = useTransform(scrollYProgress, [0.72, 0.95], ["20px", "0px"]);

  return (
    <div ref={containerRef} style={{ height: "550vh" }} className="relative">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: "linear-gradient(160deg, #06111e 0%, #0a1c35 60%, #06111e 100%)" }}
      >
        <Header />
        <MapCanvas />

        <div className="relative z-10 w-full h-full pointer-events-none">
          <motion.div
            className="absolute left-10 bottom-44"
            style={{ opacity: textOpacity1 }}
          >
            <p className="text-xs tracking-[0.35em] text-gray-300 mb-3 font-light">RETRORIKA</p>
            <div className="w-px h-14 bg-white/25 ml-1" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 right-8 md:right-14 -translate-y-1/2 max-w-xs"
            style={{ opacity: textOpacity2 }}
          >
            <div className="border border-white/12 p-5 backdrop-blur-md bg-black/20">
              <p className="text-xs font-light leading-relaxed text-gray-300 tracking-wide">
                Hampir semua kebutuhan dapur kami beli dari petani
                lokal Kota Batu dan sekitarnya, baik dari tangan pertama
                atau melalui pasar tradisional
              </p>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-28 left-1/2 -translate-x-1/2 text-center"
            style={{ opacity: textOpacity3, y: text3Y }}
          >
            <p className="text-xs tracking-[0.4em] text-gray-400 font-light">KEBUN KOPI</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
