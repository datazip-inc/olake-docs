# Parked: OLake Go homepage (v1)

This is the homepage that served `/` before the `feat/landing-pages-v2` experiment. It is
kept here, unrouted, so the site can revert in minutes. It is otherwise unchanged from
`master` — the only edit was fixing its imports to use the `@site/...` alias after the move
(see git history on this file).

Its dependencies were **not** touched by the experiment and don't need restoring:
`src/components/site/*`, `src/components/LazyComponent.tsx` (`COMPONENT_MAP` /
`LazyComponentName`), and `src/components/LightModeEnforcer.jsx`.

## Full revert procedure

1. **Homepage**
   - Delete `src/pages/index.tsx` (the temporary re-export, or the finished v2 homepage —
     whichever is currently there).
   - `git mv src/legacy/home-v1/index.jsx src/pages/index.jsx`.
   - In `src/pages/index.jsx`, change the four `@site/src/components/...` imports
     (`DataWarehouseToLakes`, `WorkflowSection`, `LazyComponent`, `LightModeEnforcer`) back to
     `../components/...` if you want byte-parity with the pre-experiment file (not required —
     the alias form works identically).
   - Delete `src/pages/olake-go.tsx` and `src/pages/olake-fusion.tsx`.
   - Delete `src/components/landing/`, `src/data/landing/`, and `static/img/landing/`.

2. **Navbar**
   - Delete `src/theme/Navbar/` entirely. It is purely additive — removing it restores the
     stock Docusaurus navbar driven by `docusaurus.config.js`.

3. **Footer**
   - `git mv src/legacy/footer-v1/index.tsx src/theme/Footer/index.tsx`.
   - `git mv src/legacy/footer-v1/index-2.tsx src/theme/Footer/index-2.tsx`.
   - Delete `src/legacy/footer-v1/`.

4. **Config**
   - In `docusaurus.config.js`, revert the "Talk to us" navbar item href and the "Pricing"
     item href back to `/#olake-form-product` and `/ai-lake` respectively (check git blame /
     diff on this branch for the exact prior values).

5. **CSS / fonts**
   - Remove the `.landing-v2` block appended to the end of `src/css/custom.css`.
   - Remove the JetBrains Mono family from the Google Fonts URL in
     `static/font-loading-optimizer.js`.

6. **Cleanup**
   - Delete `src/legacy/` once steps 1–3 are done.

## Second escape hatch

Everything above lives on the `feat/landing-pages-v2` branch. If it was merged to `master`,
`git revert` the merge commit is a faster path back than the manual steps above.
