import { motion, useTransform, MotionValue } from "framer-motion";
import { useMemo } from "react";

interface WordRevealProps {
  children: string;
  className?: string;
  delay?: number;
  scrollProgress: MotionValue<number>;
  startProgress?: number;
  endProgress?: number;
}

export default function WordReveal({ 
  children, 
  className = "", 
  delay = 0,
  scrollProgress,
  startProgress = 0,
  endProgress = 0.3
}: WordRevealProps) {
  const words = useMemo(() => children.split(" "), [children]);

  // Simple opacity animation for all words together (no blur = smooth on mobile)
  const containerOpacity = useTransform(
    scrollProgress,
    [startProgress + delay, startProgress + delay + 0.08],
    [0, 1]
  );
  
  const containerY = useTransform(
    scrollProgress,
    [startProgress + delay, startProgress + delay + 0.08],
    [15, 0]
  );

  // Add Playfair Display font and text shadow to className
  const fullClassName = `${className} [font-family:'Playfair_Display',serif] [text-shadow:0_2px_48px_rgba(0,0,0,0.8),0_0_80px_rgba(0,0,0,0.5)]`;

  // Unified: Simple opacity + Y animation (smooth on all devices)
  return (
    <motion.div 
      className={fullClassName}
      style={{ 
        opacity: containerOpacity, 
        y: containerY, 
        willChange: "transform, opacity" 
      }}
    >
      {children}
    </motion.div>
  );
}
