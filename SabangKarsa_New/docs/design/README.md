# SabangKarsa: coastal experience redesign

The visitor experience now leads with the existing Sabang film and gives accommodation, transport, and local guides a direct place in the navigation. The visual system uses deep sea green, warm sand, local photography, restrained borders, and editorial headings. Its purpose is to make choosing a service feel clear and personal.

## Preview

The landing screenshots use repository content, not invented bookings or reviews. Reduced-motion mode was enabled during capture, so the video shows its poster. The existing WebM/MP4 film plays for visitors with the default motion preference; it can be paused.

- [Desktop landing page](landing-desktop.webp)
- [Mobile landing page](landing-mobile.webp)
- [First-screen preview](landing-preview.webp)

## Scope

- Rebuilt home page, compact navigation, mobile disclosure menu, footer, and travel-service entry points.
- Rebuilt accommodation, rental, and guide catalogues around one shared component with name/location search, category filters, price/name sorting, loading placeholders, explicit request failure/retry, and resettable empty results.
- Redesigned service detail introductions, authentication layouts, and public listing introductions (destinations, events, culinary, information, about).
- Applied shared surfaces, typography, spacing, dark mode, and form treatment to detail, booking, order, seller, admin, and verification screens. These workflows retain their existing business logic rather than being rewritten as part of a visual change.
- Fixed Tailwind v4 semantic colour mapping and class-based dark variants. Retained the existing locally hosted Plus Jakarta Sans files and removed the unused import of missing Poppins files.
- Removed the artificial four-second route transition. Added video controls, reduced-motion support, keyboard-friendly navigation, labelled authentication fields, and compact initial dashboard sidebars on narrow screens.
- Replaced the clipped, scroll-dependent footer. The new home page does not display the old static social-proof counters or testimonials.

The API base URL, credentials, payment providers, backend, existing video files, and routes are unchanged. No external fonts or UI dependencies were added.

## Validation

- `npm ci --no-audit --no-fund` and `npm run build`: passed.
- Targeted ESLint on the new experience components, navigation, hero, footer, home, route wrapper, and not-found screen: passed.
- `git diff --check`: passed.
- Chromium UI smoke checks: 41 route/viewport combinations, no uncaught page JavaScript errors and no document horizontal overflow.
- Desktop 1440px and mobile 390px: home; destination list/detail; culinary, events, information, about; login/register; all three service lists and details; all three booking forms; buyer orders; seller verification. Seller dashboard also checked at 390px.
- Exercised mobile menu open/Escape close, dark/light mode, Indonesian/English switching, price sorting, category filtering, no-match/reset, and failed catalogue request/retry.
- Inspected rendered landing, catalogue, service detail, login, booking, and seller dashboard screenshots.

Authenticated screens and service data were tested using intercepted local fixtures explicitly labelled as test data. No booking/payment was submitted, no production API was mutated, and no test fixtures are included in the application. End-to-end production login, payments, callbacks, seller changes, and real inventory remain outside this UI validation.

The production build still reports the existing large JavaScript bundle warning (approximately 999 kB uncompressed). Route-level code splitting remains a separate performance task.

## Review locally

From `SabangKarsa_New`:

```sh
npm ci
npm run dev
```

Set `VITE_API_URL` using the project's existing deployment configuration to review real service inventory. With no backend available, the catalogue presents an explicit error and retry state. Review the draft branch before merging into the deployment branch.
