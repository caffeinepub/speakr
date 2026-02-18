# Specification

## Summary
**Goal:** Revert the recent Feed banner and slogan UI changes so the Feed page returns to its pre-banner state.

**Planned changes:**
- Remove the full-width hero banner from the Feed page by stopping rendering of the `FeedHeroBanner` on route `/`.
- Remove the recently added slogan text “Giving everyone a voice!” from the Feed UI and eliminate any hardcoded instances introduced by the banner/slogan change set.
- Delete/cleanup any now-unused banner asset references (including `/assets/generated/feed-hero-banner.dim_2400x600.png`) and ensure the frontend builds cleanly without TypeScript/lint errors from removed imports/components.

**User-visible outcome:** Visiting the Feed page no longer shows the hero banner image or the “Giving everyone a voice!” slogan, and the UI appears as it did before the recent banner/slogan updates.
