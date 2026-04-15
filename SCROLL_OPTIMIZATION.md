# Scroll Optimization with Lenis

## Overview
This project uses [Lenis](https://lenis.dev/) for smooth, consistent scrolling across all devices and input methods (mouse wheel, trackpad, touch).

## Key Features

### 1. Unified Scroll Experience
- Same smooth experience on desktop (mouse/trackpad) and mobile (touch/swipe)
- Normalized wheel events for consistent behavior
- Optimized touch multipliers for responsive mobile scrolling

### 2. Mobile-Specific Optimizations

#### Lenis Configuration
```typescript
// Faster duration on mobile (0.8s vs 1.2s desktop)
duration: isMobile ? 0.8 : 1.2

// Optimized multipliers
wheelMultiplier: isMobile ? 0.8 : 1.0
touchMultiplier: isMobile ? 1.5 : 2.0

// Smooth touch sync
syncTouch: true
syncTouchLerp: 0.1
```

#### CSS Optimizations
- GPU acceleration for sticky elements: `transform: translateZ(0)`
- Prevent pull-to-refresh: `overscroll-behavior-y: none`
- Prevent zoom on double-tap: `touch-action: manipulation`
- iOS smooth scrolling: `-webkit-overflow-scrolling: touch`

#### WebGL Optimizations (HeroSection)
- Low precision shaders on mobile: `precision: "lowp"`
- Disabled stencil and depth buffers
- Power-efficient rendering mode

### 3. Performance Features

#### RAF-Based Animations
- LogoRetrorikaSection uses pure RAF loop (no anime.js)
- Smooth bidirectional scrolling (forward and reverse)
- Minimal overhead with direct style manipulation

#### GPU Acceleration
- All sticky containers: `transform: translateZ(0)`
- All animated images: `transform: translateZ(0)`
- Prevents layout thrashing and ensures 60fps
- Applied to:
  - HeroSection: sticky container, canvas, images
  - LogoRetrorikaSection: sticky container, all logo elements
  - CounterCommitmentSection: sticky container, background images, crop images

#### Conditional Rendering
- HeroSection dissolve effect only renders during active scroll
- Automatic start/stop of render loop based on scroll progress
- Prevents unnecessary GPU usage

#### Responsive Updates
- Automatic Lenis resize on window resize
- ScrollTrigger refresh on layout changes
- Mobile detection with optimized settings

## Usage

### Basic Setup
Lenis is automatically initialized in `App.tsx`:
```typescript
useLenisSetup();
```

### Scroll Progress Tracking
Use Framer Motion's `useScroll` for scroll-linked animations:
```typescript
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start end", "end start"],
});
```

### Custom Scroll Control
Access Lenis instance for programmatic control:
```typescript
import { getLenis } from "@/lib/useLenis";

const lenis = getLenis();
lenis?.scrollTo(target, { duration: 2 });
```

## Browser Support
- Modern browsers with smooth scroll support
- Graceful fallback on older browsers
- iOS Safari optimized with `-webkit-` prefixes
- Android Chrome optimized with touch events

## Performance Tips
1. Use `will-change` sparingly (desktop only)
2. Leverage GPU acceleration with `translateZ(0)`
3. Minimize layout thrashing with RAF batching
4. Use `passive: true` for scroll listeners
5. Optimize images with WebP format

## Testing
- Test on real devices for accurate touch behavior
- Check scroll performance with Chrome DevTools Performance tab
- Verify smooth scrolling at 60fps on mobile
- Test with different scroll speeds and gestures
