import { motion } from "framer-motion";
import { getLenis } from "../lib/useLenis";

interface HeaderProps {
  dark?: boolean;
}

export default function Header({ dark = false }: HeaderProps) {
  const textClass = dark ? "text-black" : "text-white";
  const borderClass = dark ? "border-black/30 hover:bg-black/10" : "border-white/30 hover:bg-white/10";

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: false, duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 ${textClass}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <button
        onClick={scrollToTop}
        className="retrorika-font text-sm tracking-widest font-light opacity-90 hover:opacity-100 transition-opacity"
      >
        RETRORIKA
      </button>
      <button
        className={`retrorika-font text-sm tracking-widest font-light opacity-90 border px-5 py-2 transition-all duration-300 ${borderClass}`}
      >
        OUR MENU
      </button>
    </motion.header>
  );
}
