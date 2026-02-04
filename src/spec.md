# Specification

## Summary
**Goal:** Trigger the final “Congratulations!” completion message and transition to the outro when the player picks up their 7th unique star (in any order), with the specified modal formatting.

**Planned changes:**
- Update star-collection completion logic to detect when `collectedCount` reaches 7 unique collectibles, regardless of collectible ID or pickup order.
- Ensure the 7th unique pickup modal appends the completion message, and that clicking Continue transitions from gameplay to the outro exactly once.
- Implement the completion message formatting in the pickup modal: a visually separated empty line with 12px top margin, then a bold “Congratulations!” with 🌟 on the same line, followed by a line break and the provided sentence.

**User-visible outcome:** After collecting any 7 unique stars, the 7th pickup modal shows the formatted completion message; pressing Continue then moves the player from gameplay into the outro. Collecting fewer than 7 stars does not trigger the outro.
