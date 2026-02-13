# Specification

## Summary
**Goal:** Expand the app’s built-in language list using an authoritative base-language standard and ensure languages display in a single perfectly alphabetical list everywhere.

**Planned changes:**
- Expand `SUPPORTED_LANGUAGES` in `frontend/src/constants/languages.ts` to a comprehensive set of base world languages derived from an authoritative standard (e.g., ISO 639-1), using stable base language codes and English labels, while keeping `{ code: 'none', label: 'No language (music)' }`.
- Ensure `getBrowserDefaultLanguage()` returns a supported base language code when possible; otherwise fall back to `en`.
- Sort languages strictly alphabetically (case-insensitive) by English label as a single combined list (built-in + custom) in:
  - `frontend/src/components/layout/FloatingLanguageSelector.tsx`
  - `frontend/src/components/language/LanguageMultiSelectDropdown.tsx`
- Keep the combined list perfectly alphabetized after adding a custom language (no refresh) and after reload when custom languages are loaded from `localStorage`.

**User-visible outcome:** Users can select from a more complete set of base languages, and all language pickers show one unified list that is always perfectly alphabetized, including newly added custom languages.
