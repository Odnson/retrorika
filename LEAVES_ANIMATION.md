# Leaves Animation: Natural Scroll Movement

## Concept
Daun PNG bergerak ke atas secara natural mengikuti scroll, bukan fade out. Daun terus bergerak melewati layar dan menghilang secara alami di atas.

## Implementation

### CounterCommitmentSectionV2
```typescript
// Leaves movement timeline
const leavesY = useTransform(scrollYProgress, (v: number) => {
  if (v < 0.24) return "15%";        // Start position
  if (v < 0.42) return "0%";         // Move to center
  if (v < 0.70) return "-15%";       // Gentle parallax
  
  // Continue moving up (0.70 - 1.0)
  const dissolveProgress = (v - 0.70) / 0.30;
  return `${-15 - dissolveProgress * 185}%`; // -15% → -200%
});
```

### LogoRetorikaSectionV2
```typescript
// Continue leaves movement
useEffect(() => {
  return scrollYProgress.on('change', (v) => {
    // First 2x scroll (0 - 0.44 of 450vh ≈ 200vh)
    if (v < 0.44) {
      const leavesProgress = v / 0.44;
      setLeavesYOffset(-200 - leavesProgress * 200); // -200% → -400%
    } else {
      setLeavesYOffset(-400); // Completely off screen
    }
  });
}, [scrollYProgress]);
```

## Movement Timeline

```
CounterCommitment Section (800vh):
├─ 0.00-0.24: Leaves at 15% (below center)
├─ 0.24-0.42: Move to 0% (center)
├─ 0.42-0.70: Gentle parallax to -15%
└─ 0.70-1.00: Move up to -200% (dissolve phase)

LogoRetorika Section (450vh):
├─ 0.00-0.44: Continue moving -200% → -400%
└─ 0.44+:     Stay at -400% (off screen)
```

## Visual Flow

```
Screen Position:
  100% ┐
       │
   50% ├─ Leaves start here (15%)
       │
    0% ├─ Center position
       │
  -50% │
       │
 -100% ├─ End of CounterCommitment
       │
 -200% ├─ Leaves position at section transition
       │
 -300% │
       │
 -400% └─ Leaves completely off screen (2x scroll in LogoRetorika)
```

## Key Features

1. **Natural Movement**: Leaves move continuously upward, no fade out
2. **Smooth Transition**: Seamless handoff between sections
3. **Fixed Positioning**: z-100 ensures always visible during movement
4. **Scroll-Based**: Movement tied to scroll progress, feels natural
5. **Complete Exit**: Leaves fully off screen after 2x scroll in LogoRetorika

## Result
✅ Leaves move naturally upward with scroll
✅ No abrupt fade out or disappearance
✅ Smooth continuous motion across sections
✅ Natural exit off the top of screen
