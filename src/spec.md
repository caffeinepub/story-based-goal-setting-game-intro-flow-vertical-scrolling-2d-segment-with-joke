# Specification

## Summary
**Goal:** Update the app’s browser tab title and ensure certificates can only be downloaded by players who have completed the game, using the correct player’s Wall of Fame entry.

**Planned changes:**
- Update `frontend/index.html` so the document `<title>` is exactly `Barnabus, The Undeterred`.
- In the Hall/Wall of Fame view, only render the “Download Your Certificate” button when the local completion flag indicates completion (`hasCompleted === true`).
- When the download button is shown, generate the certificate using the completed player’s matching Wall of Fame entry (`playerEntry`) instead of the last list entry; if no matching entry is found, keep the button disabled.

**User-visible outcome:** The browser tab shows “Barnabus, The Undeterred”, and players only see (and can use) the certificate download option after completing the game; the downloaded certificate reflects their own Wall of Fame name when available.
