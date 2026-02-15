# Specification

## Summary
**Goal:** Remove sticky/fixed header behavior and make the header logo centered and more visually clear on desktop and mobile.

**Planned changes:**
- Remove sticky/fixed positioning from the main header and any header sub-rows so the header remains in normal document flow and scrolls away with content.
- Update header layout so the logo is horizontally centered within the top header area on both desktop and mobile without overlapping other controls.
- Improve logo visibility/clarity (e.g., larger rendering size and/or stronger contrast against the header background) while preserving the existing text fallback (“SPEAKR”) when the logo image fails to load.

**User-visible outcome:** When scrolling, the header scrolls away with the page, and the logo appears centered and easier to see on both desktop and mobile (with the “SPEAKR” fallback still working if the image doesn’t load).
