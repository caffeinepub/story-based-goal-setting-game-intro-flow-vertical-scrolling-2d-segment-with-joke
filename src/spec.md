# Specification

## Summary
**Goal:** Update certificate download to use the provided PDF template with a dynamic name overlay, and visually center Wall of Fame entries within their existing 3-column layout.

**Planned changes:**
- Update the “Download Your Certificate” flow to generate a PDF using the provided certificate template PDF as the base page, then overlay the player’s name on top of the underscore region at the top, centered horizontally relative to that underscore area.
- Preserve the existing Key Takeaways behavior by appending the Key Takeaways content as an additional page after the template’s page(s).
- Adjust Wall of Fame rendering so each entry’s text (number + name) is horizontally centered within each of the three existing columns.

**User-visible outcome:** Downloading a certificate produces a valid PDF that matches the provided template with the player’s name centered over the underscore line, followed by the Key Takeaways page; Wall of Fame names appear centered within each column without changing the 3-column layout.
