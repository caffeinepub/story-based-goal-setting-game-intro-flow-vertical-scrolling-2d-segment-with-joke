# Specification

## Summary
**Goal:** Build a reflective, story-based intro flow with interactive steps, then transition into a vertical-scrolling 2D game segment with keyboard controls and random joke speech balloons.

**Planned changes:**
- Implement the intro narrative as sequential story screens/steps, rendering the user-provided story text verbatim and in order, with clear progression controls where required.
- Add a soft, fun gradient background (no images) for the intro, and smoothly transition it to a darker/gloomier scheme during the specified “So many ambitions to satisfy...” portion as text progresses.
- Add a colorful, bouncy “Start now!” button that appears only at the specified story point and must be clicked to continue.
- Add the 1–100% slider + “Submit” interaction; show conditional feedback (5–10% inclusive vs otherwise), then continue the story and visually emphasize: “Only about 8% of people manage to fulfill their goals.”
- After the intro finishes, transition into a 2D game view with a mostly vertical playfield, a brown color-scheme map, and continuous top-to-bottom map scrolling.
- Implement gameplay controls: arrow keys move the character; Space selects randomly from exactly 5 in-app jokes and shows the joke in a readable speech balloon emerging from the character.
- Apply a consistent visual theme (colors/typography/spacing/component styling) across both intro and gameplay UI, avoiding a blue/purple primary palette.

**User-visible outcome:** Users can progress through a verbatim story-driven intro with a gradient-to-gloom transition, interact with a “Start now!” gate and a slider quiz with conditional feedback, then play a vertical-scrolling 2D segment where they move a character with arrow keys and press Space to display random jokes in a speech bubble.
