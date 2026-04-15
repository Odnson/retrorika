import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GeoFeature {
  type: string;
  geometry: any;
  properties: any;
  id?: string | number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}
function norm(val: number, lo: number, hi: number) {
  return Math.max(0, Math.min(1, (val - lo) / (hi - lo)));
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function easeSmoothStep(t: number) {
  return t * t * (3 - 2 * t);
}

function interpolateProjection(raw0: any, raw1: any) {
  const mutate: any = (d3 as any).geoProjectionMutator(
    (t: number) => (x: number, y: number) => {
      const [x0, y0] = raw0(x, y);
      const [x1, y1] = raw1(x, y);
      return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)];
    }
  );
  let t = 0;
  return Object.assign((mutate as any)(t), {
    alpha(_: number) {
      return arguments.length ? (mutate as any)((t = +_)) : t;
    },
  });
}

const GLOBE_LON = 117;
const GLOBE_LAT = -5;

const RETRORIKA_LON = 112.53;
const RETRORIKA_LAT = -7.89;

const LOCATIONS = [
  { lon: 112.53, lat: -7.89, label: "RETRORIKA", sublabel: "Kota Batu" },
  { lon: 112.38, lat: -8.06, label: "KEBUN KOPI", sublabel: "" },
  { lon: 112.61, lat: -7.95, label: "PETANI LOKAL", sublabel: "Areal Pertanian" },
];

export default function GlobeMapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<GeoFeature[]>([]);
  const progressRef = useRef(0);
  const frameRef = useRef(0);
  const [isInView, setIsInView] = useState(false);
  
  // State for motion values (controlled by GSAP)
  const [globeTextOpacity, setGlobeTextOpacity] = useState(1);
  const [infoBoxOpacity, setInfoBoxOpacity] = useState(0);
  const [farmerLabelOpacity, setFarmerLabelOpacity] = useState(0);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((world: any) => {
        const countries = (feature(world, world.objects.countries) as any).features;
        setWorldData(countries);
      })
      .catch(() => setWorldData([]));
  }, []);

  const draw = useCallback(
    (timestamp: number) => {
      const svg = svgRef.current;
      if (!svg || worldData.length === 0) return;

      const p = progressRef.current;
      const W = svg.clientWidth || 900;
      const H = svg.clientHeight || 600;
      const d3svg = d3.select(svg);
      d3svg.attr("viewBox", `0 0 ${W} ${H}`);
      d3svg.selectAll("*").remove();

      const defs = d3svg.append("defs");

      const rg = defs
        .append("radialGradient")
        .attr("id", "ocean-grad")
        .attr("cx", "38%")
        .attr("cy", "32%");
      rg.append("stop").attr("offset", "0%").attr("stop-color", "#132644");
      rg.append("stop").attr("offset", "60%").attr("stop-color", "#09192e");
      rg.append("stop").attr("offset", "100%").attr("stop-color", "#030a15");

      const isMobile = W < 640;
      const globeScale = isMobile
        ? Math.min(W, H) * 0.36
        : Math.min(W * 0.55, H * 0.30, 210);
      const globeCenterY = isMobile ? H * 0.38 : H * 0.44;
      const worldScale = Math.min(W, H) * 0.155;
      const indoScale = Math.min(W, H) * 1.6;
      const javaScale = Math.min(W, H) * 5.5;
      const batuScale = Math.min(W, H) * 24;

      if (p <= 0.48) {
        const rawAlpha = norm(p, 0.20, 0.48);
        const alpha = easeInOut(rawAlpha);
        const scale = lerp(globeScale, worldScale, alpha);

        // rotate([lambda, phi]) centers on geographic (-lambda, -phi)
        // To center on (117°E, 5°S): lambda=-117, phi=5
        const rotLon = lerp(-GLOBE_LON, -115, easeInOut(rawAlpha));
        const rotLat = lerp(-GLOBE_LAT, 0, easeInOut(rawAlpha));

        const tY = lerp(globeCenterY, H / 2, alpha);
        const proj = interpolateProjection(
          (d3 as any).geoOrthographicRaw,
          (d3 as any).geoEquirectangularRaw
        )
          .scale(scale)
          .translate([W / 2, tY])
          .rotate([rotLon, rotLat, 0])
          .precision(0.1);
        proj.alpha(alpha);

        const path = (d3.geoPath as any)(proj);

        try {
          const sp = path({ type: "Sphere" });
          if (sp)
            d3svg
              .append("path")
              .datum({ type: "Sphere" })
              .attr("d", sp)
              .attr("fill", "url(#ocean-grad)")
              .attr("stroke", "none");
        } catch (_) {}

        try {
          const grat = (d3 as any).geoGraticule()();
          const gp = path(grat);
          if (gp)
            d3svg
              .append("path")
              .attr("d", gp)
              .attr("fill", "none")
              .attr("stroke", "rgba(255,255,255,0.05)")
              .attr("stroke-width", 0.5);
        } catch (_) {}

        worldData.forEach((country) => {
          try {
            const d = path(country as any);
            if (!d || d.includes("NaN") || d.includes("Infinity")) return;
            const isIndo = String(country.id) === "360";
            d3svg
              .append("path")
              .attr("d", d)
              .attr("fill", isIndo ? "#234f38" : "none")
              .attr("stroke", isIndo ? "#357a52" : "rgba(255,255,255,0.11)")
              .attr("stroke-width", isIndo ? 0.8 : 0.5);
          } catch (_) {}
        });

        try {
          const sp2 = path({ type: "Sphere" });
          if (sp2)
            d3svg
              .append("path")
              .attr("d", sp2)
              .attr("fill", "none")
              .attr("stroke", "rgba(255,255,255,0.09)")
              .attr("stroke-width", 1);
        } catch (_) {}
      } else {
        const t2 = easeInOut(norm(p, 0.48, 0.65));
        const t3 = easeInOut(norm(p, 0.65, 0.82));
        const t4 = easeSmoothStep(norm(p, 0.82, 1.0));

        let scale: number;
        let centerLon: number;
        let centerLat: number;

        // centerLon/centerLat = geographic center (positive E, positive N)
        // projection: .rotate([-centerLon, -centerLat]) centers on that point
        if (norm(p, 0.82, 1.0) > 0) {
          scale = lerp(javaScale, batuScale, t4);
          centerLon = lerp(112.5, RETRORIKA_LON, t4);
          centerLat = lerp(-7.5, RETRORIKA_LAT, t4);
        } else if (norm(p, 0.65, 0.82) > 0) {
          scale = lerp(indoScale, javaScale, t3);
          centerLon = lerp(117.5, 112.5, t3);
          centerLat = lerp(-2.5, -7.5, t3);
        } else {
          scale = lerp(worldScale, indoScale, t2);
          centerLon = lerp(115, 117.5, t2);
          centerLat = lerp(0, -2.5, t2);
        }

        const proj = (d3.geoEquirectangular as any)()
          .scale(scale)
          .translate([W / 2, H / 2])
          .rotate([-centerLon, -centerLat, 0])
          .precision(0.1);

        const path = (d3.geoPath as any)(proj);

        const fadeIn = Math.min(1, norm(p, 0.48, 0.56));
        const bgOpacity = lerp(0.0, 1, fadeIn);
        if (bgOpacity < 0.98) {
          d3svg
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", W)
            .attr("height", H)
            .attr("fill", `rgba(3,9,18,${1 - bgOpacity})`);
        }

        worldData.forEach((country) => {
          try {
            const d = path(country as any);
            if (!d || d.includes("NaN") || d.includes("Infinity")) return;
            const isIndo = String(country.id) === "360";
            d3svg
              .append("path")
              .attr("d", d)
              .attr("fill", isIndo ? "#234f38" : "rgba(255,255,255,0.025)")
              .attr("stroke", isIndo ? "#357a52" : "rgba(255,255,255,0.08)")
              .attr("stroke-width", isIndo ? 0.5 : 0.4);
          } catch (_) {}
        });

        try {
          const grat = (d3 as any).geoGraticule()();
          const gp = path(grat);
          if (gp)
            d3svg
              .append("path")
              .attr("d", gp)
              .attr("fill", "none")
              .attr("stroke", "rgba(255,255,255,0.035)")
              .attr("stroke-width", 0.35);
        } catch (_) {}

        if (p > 0.62) {
          const dotFade = easeInOut(norm(p, 0.62, 0.75));
          const pulse = 0.5 + Math.sin(timestamp / 600) * 0.5;
          const showAll = p > 0.82;
          const dotCount = showAll ? 3 : 1;

          LOCATIONS.slice(0, dotCount).forEach((loc, i) => {
            try {
              const pos = proj([loc.lon, loc.lat]);
              if (!pos || isNaN(pos[0]) || isNaN(pos[1])) return;
              const [px, py] = pos;
              if (px < -30 || px > W + 30 || py < -30 || py > H + 30) return;

              const iPulse = 0.5 + Math.sin(timestamp / 600 + i * 2.0) * 0.5;

              d3svg
                .append("circle")
                .attr("cx", px)
                .attr("cy", py)
                .attr("r", 22 + iPulse * 11)
                .attr("fill", `rgba(255,80,40,${dotFade * 0.09 * iPulse})`);

              d3svg
                .append("circle")
                .attr("cx", px)
                .attr("cy", py)
                .attr("r", 5.5)
                .attr("fill", `rgba(255,60,30,${dotFade})`);

              d3svg
                .append("circle")
                .attr("cx", px)
                .attr("cy", py)
                .attr("r", 2.5)
                .attr("fill", `rgba(255,215,205,${dotFade})`);

              const labelFade = easeInOut(norm(p, 0.68, 0.78)) * dotFade;
              if (labelFade > 0.02) {
                d3svg
                  .append("line")
                  .attr("x1", px)
                  .attr("y1", py - 8)
                  .attr("x2", px)
                  .attr("y2", py - 38)
                  .attr("stroke", `rgba(255,255,255,${labelFade * 0.4})`)
                  .attr("stroke-width", 0.7);

                d3svg
                  .append("text")
                  .attr("x", px + 9)
                  .attr("y", py - 34)
                  .attr("fill", `rgba(255,255,255,${labelFade})`)
                  .attr("font-size", "7.5px")
                  .attr("font-family", "'Cinzel', serif")
                  .attr("letter-spacing", "2")
                  .text(loc.label);

                d3svg
                  .append("text")
                  .attr("x", px + 9)
                  .attr("y", py - 21)
                  .attr("fill", `rgba(160,200,170,${labelFade * 0.75})`)
                  .attr("font-size", "6px")
                  .attr("font-family", "'Inter', sans-serif")
                  .attr("letter-spacing", "0.5")
                  .text(loc.sublabel);
              }
            } catch (_) {}
          });
        }
      }
    },
    [worldData]
  );

  useEffect(() => {
    const loop = (ts: number) => {
      draw(ts);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [draw]);

  // GSAP ScrollTrigger for smooth scroll integration with Lenis
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => setIsInView(true),
        onLeave: () => setIsInView(false),
        onEnterBack: () => setIsInView(true),
        onLeaveBack: () => setIsInView(false),
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5, // Smooth scrub for mobile
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          
          // Update opacity values
          if (p <= 0.09) {
            setGlobeTextOpacity(1);
          } else if (p <= 0.20) {
            setGlobeTextOpacity(1 - (p - 0.09) / 0.11);
          } else {
            setGlobeTextOpacity(0);
          }
          
          // Info box opacity
          if (p < 0.72) {
            setInfoBoxOpacity(0);
          } else if (p <= 0.82) {
            setInfoBoxOpacity((p - 0.72) / 0.10);
          } else if (p <= 0.94) {
            setInfoBoxOpacity(1);
          } else {
            setInfoBoxOpacity(1 - (p - 0.94) / 0.06 * 0.7);
          }
          
          // Farmer label opacity
          if (p < 0.84) {
            setFarmerLabelOpacity(0);
          } else if (p <= 0.90) {
            setFarmerLabelOpacity((p - 0.84) / 0.06);
          } else if (p <= 0.97) {
            setFarmerLabelOpacity(1);
          } else {
            setFarmerLabelOpacity(1 - (p - 0.97) / 0.03 * 0.7);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ height: "600vh" }} className="relative">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 42% 36%, #0c1e38 0%, #060f1c 55%, #020609 100%)",
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.6, delay: 0.5, ease: "easeOut" }}
        >
          <svg ref={svgRef} className="w-full h-full" style={{ display: "block" }} />
        </motion.div>

        <div className="relative z-10 w-full h-full pointer-events-none">
          <motion.div
            className="absolute bottom-20 sm:bottom-16 left-1/2 -translate-x-1/2 text-center w-full px-6"
            style={{ opacity: globeTextOpacity }}
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: globeTextOpacity, y: 0 } : { opacity: 0 }}
            transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
          >
            <div className="w-8 h-px bg-white/20 mx-auto mb-5" />
            <p
              className="text-xl sm:text-xl md:text-2xl font-light tracking-wide leading-relaxed text-gray-200 max-w-sm mx-auto"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Mengurangi jejak karbon
              <br />
              dengan membeli hasil bumi
              <br />
              setempat
            </p>
          </motion.div>

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 md:right-12 max-w-[200px] sm:max-w-xs"
            animate={{ opacity: infoBoxOpacity }}
            transition={{ duration: 0.3 }}
          >
            <div className="border border-white/[0.08] p-4 sm:p-5 backdrop-blur-sm bg-black/30">
              <p
                className="text-[7px] sm:text-[8px] tracking-[0.45em] text-emerald-400/80 mb-2 sm:mb-3 font-light uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Local Sourcing
              </p>
              <p className="text-[10px] sm:text-[11px] font-light leading-relaxed text-gray-400 tracking-wide">
                Hampir semua kebutuhan dapur kami beli dari petani lokal Kota
                Batu dan sekitarnya, baik dari tangan pertama atau melalui pasar
                tradisional.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 text-center"
            animate={{ opacity: farmerLabelOpacity }}
            transition={{ duration: 0.3 }}
          >
            <p
              className="text-[7px] sm:text-[8px] tracking-[0.5em] sm:tracking-[0.6em] text-emerald-300/60 font-light uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Kebun Kopi · Petani Lokal · Retrorika
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

