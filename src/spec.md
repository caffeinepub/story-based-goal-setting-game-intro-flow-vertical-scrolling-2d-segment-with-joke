# Specification

## Summary
**Goal:** Improve the game experience by fixing intermittent background-music resume issues, adding a pre-game sound reminder line, and ensuring the Wall of Fame reliably loads entries when opened from its link.

**Planned changes:**
- Fix gameplay audio flow so background music reliably resumes after being paused for the star-collection sound, including when stars are collected rapidly in succession.
- Update the specified pre-game narrative section by appending the exact final line: "Also, it's recommended for you to turn on sound."
- Fix Wall of Fame data-loading so navigating via the "Wall of Fame" link fetches and renders persisted entries immediately (showing loading while fetching as needed), for both anonymous and authenticated users.

**User-visible outcome:** Background music consistently comes back after collecting stars, the pre-game narrative includes a sound-on recommendation, and the Wall of Fame shows existing entries when opened directly from its link.
