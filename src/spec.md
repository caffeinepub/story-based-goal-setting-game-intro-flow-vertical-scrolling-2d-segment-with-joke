# Specification

## Summary
**Goal:** Expand the post-game OutroFlow with an additional narrative block, an updated first block, and an interactive 7-item takeaways list with popups—while preserving existing flow, styling, and reveal/gating behavior.

**Planned changes:**
- Update the first outro text block to reveal a new third line (“That can't be it...”) after the existing two lines, and show a Continue button only after the block finishes revealing.
- Add a new second outro block that reveals the provided multi-line narrative text line-by-line, then gates progression with a Continue button.
- Add a new third outro block showing a 7-item underlined takeaways list with pointer cursor; clicking an item opens a closable popup/modal containing placeholder lorem ipsum text and a link to https://lmt.lv.
- Keep the outro integrated into the existing post-game transition and reuse existing OutroFlow stage system, animations, typography, gradient background, button style, and popup styling patterns (no new navigation paths).

**User-visible outcome:** After finishing the game, players see an extended outro sequence with two Continue-gated narrative blocks, followed by a clickable 7-item takeaways list where each item opens a popup with placeholder text and a link.
