import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function CommitmentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const sectionY = useTransform(scrollYProgress, [0, 0.3], [80, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-white text-black light-section overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ scaleY: 0, originY: 1 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: "bottom" }}
      />

      <motion.div
        className="relative text-center px-8 max-w-xl"
        style={{ y: sectionY, opacity: sectionOpacity }}
      >
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 30, scale: 0.85 }
          }
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        >
          <img
            src="/favicon.png"
            alt="RETRORIKA"
            width={88}
            height={88}
            className="object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        >
          <p
            className="text-lg md:text-xl font-light leading-loose text-gray-600 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Retrorika adalah satu-satunya
            <br />
            resto yang menerapkan prinsip
            <br />
            <em className="not-italic font-normal text-black tracking-widest text-base">
              less waste and low carbon
            </em>
            <br />
            di Indonesia
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
