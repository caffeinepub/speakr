# Specification

## Summary
**Goal:** Add a delete option in the main feed so signed-in users can permanently remove their own published uploads (including the “test” post) and delete local draft uploads, with proper per-user authorization.

**Planned changes:**
- Show a delete action in the main feed only for backend uploads authored by the currently authenticated user (including the backend upload titled “test”).
- Implement backend deletion for published uploads that permanently removes the post and its associated stored audio blob.
- Implement draft deletion that removes the draft feed item and deletes its data from local device storage (e.g., localStorage).
- Enforce per-user authorization: backend rejects non-author delete attempts; frontend hides delete for non-authors and shows an English error message if a non-author attempts deletion.

**User-visible outcome:** Signed-in users see a delete option on their own uploads in the main feed and can permanently delete them (including the “test” upload); drafts can be removed locally and won’t return after refresh; users cannot delete others’ posts.
