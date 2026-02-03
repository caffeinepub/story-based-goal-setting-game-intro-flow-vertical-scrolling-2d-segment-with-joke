# Specification

## Summary
**Goal:** Improve intro flow layout consistency and CTA styling, and make the 2D top-down game movement/camera feel more like classic Zelda while keeping forward progression top-to-bottom.

**Planned changes:**
- Add a consistent additional 25vh top offset to all stages in `IntroFlow` so each intro screen starts lower while remaining top-aligned and stable (no stage-to-stage vertical shifting).
- Update all "Continue" buttons across the intro flow and the "Submit" button in `GoalStickinessQuestion` to a unified pill style (100px radius, transparent background, 1px solid border whose color matches the current text color), without changing other CTAs.
- Adjust 2D canvas movement to be smooth and continuous while arrow keys are held (not OS key-repeat) and update camera/scrolling feel so the world progresses top-to-bottom in a camera-like way; keep a brown, Zelda-inspired terrain aesthetic without adding enemies, combat, collisions, or obstacle blocking.

**User-visible outcome:** Intro screens appear consistently lower on the page without jumping, Continue/Submit buttons share a consistent outlined pill look, and the top-down game controls and scrolling feel smoother and more Zelda-like while still moving the map downward.
