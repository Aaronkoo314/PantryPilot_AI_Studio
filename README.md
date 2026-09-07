# PantryPilot — the Google AI Studio build

A front-end prototype that helps non-professional home cooks answer one question:
**what should I cook with what I already have?**

**Author: Aaron Koo**

Built for MGMT 6110 Human-AI Collaboration, Singapore Management University.

This repository is **one of two builds of the same brief.** The identical master prompt was run in
two different tools on the same day:

| Build | Repository | How it was made |
| --- | --- | --- |
| **This one** | `Aaronkoo314/PantryPilot_AI_Studio` | Google AI Studio — **one prompt, one generation** |
| Companion | [`Aaronkoo314/pantrypilot`](https://github.com/Aaronkoo314/pantrypilot) | Claude Code — dozens of prompts over about 14 hours |

Reading them together is the point. The coursework documents below are written as that comparison.

## Live app

> **Deployed URL:** _to be added_

## Coursework documents

- **[PROMPTS.md](PROMPTS.md)** — the prompt, a clause-by-clause audit of what the generation
  actually delivered against it, an index of every defect found, and a section on the places the
  prompt itself went wrong.
- **[REFLECTION.md](REFLECTION.md)** — the five-question reflection, written as a comparison
  against the companion build, plus the further-action list.

Both are Markdown (`.md`), UTF-8, plain text. Both carry the author's name at the top.

## The user journey

1. **Meal Setup** — search or browse 26 invented ingredients across five categories, or use the
   *Common essentials* / *Select all* / *Clear* presets. Say how many people are eating, how much
   time you have (15 / 30 / 60+ minutes) and what kind of meal you want (Regular, Quick & Easy,
   Fitness, Family Meal). Press **Find Meals**.
2. **Meal Recommendations** — a list of meal cards showing ingredient match percentage, cooking
   time, servings, calories per person, difficulty, category and anything you are missing. Sort by
   match, time or calories; filter by cooking time and meal preference; or show only meals that
   need no extra shopping.
3. **Meal Detail** — the full recipe: what you have, what you still need, prep / cook / total
   time, calories per person and in total, protein / carbohydrates / fat, a serving-size control
   that rescales every ingredient quantity while calories per person stay fixed, step-by-step
   instructions and a chef's tip.

A sticky navigation bar moves between the three steps. All three live in one page, so moving
between them never reloads the browser.

## Running it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (`http://localhost:3000`).

To produce a production build:

```bash
npm run build
```

The output is a static site in `dist/`, deployable as-is (Vercel detects the Vite project
automatically: build command `npm run build`, output directory `dist`).

## Scope and guardrails

- **Front end only.** No backend, no database, no accounts, no authentication, no analytics.
- **No network calls of any kind.** Every ingredient, meal, time and nutrition figure is invented
  and lives in `src/data.ts`. The app calls no AI model and no outside service.
- **No real brands.** No restaurant, grocery, delivery or company names, logos or trademarks
  appear anywhere in the interface.
- **Nutrition figures are invented sample data for a prototype.** They are **not** health,
  dietary or medical advice, and the app says so on screen.
- The name PantryPilot was chosen independently for this coursework prototype. No affiliation with
  any similarly named product or service is implied.

### How to verify the "no network calls" claim yourself

```bash
npm run build && grep -rE "fetch\(|XMLHttpRequest|WebSocket|sendBeacon" dist/
```

That returns nothing. Every URL string that survives in `dist/` is one of three non-requests, and
each can be checked by eye:

| String in `dist/` | What it is |
| --- | --- |
| `https://tailwindcss.com` | Tailwind's MIT licence banner, inside a CSS comment. Required attribution; removing it would breach the licence. |
| `http://www.w3.org/2000/svg` and three sibling namespaces | XML namespace *identifiers* used by SVG and MathML. Identifiers, not addresses — nothing fetches them. |
| `https://react.dev/errors/` | The URL React prints inside a minified error message. A string in an error path. |

## A note on what was changed after the audit

**The generated app breached two of its own guardrails, and those breaches have been fixed.**

As generated, this repository shipped an `@google/genai` dependency, a `GEMINI_API_KEY` slot in
`.env.example`, a declared `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` in `metadata.json`, and three
requests to Google's font CDN on every page load — in a build whose prompt said, in as many words,
*do NOT call Gemini or any other AI model* and *do NOT call any external API, service, database, or
URL.* No code ever called Gemini; the breach was entirely in the manifest and the environment
surface. Two of the three font requests were for a typeface the app never applied to anything.

The full finding, and why it matters more than it first appears, is
[`PROMPTS.md` §4.6](PROMPTS.md#46--a-gemini-api-surface-in-a-build-whose-guardrails-named-gemini-specifically).
Exactly what was changed, and what was deliberately left alone, is
[`PROMPTS.md` §9](PROMPTS.md#9-remediation-log).

Everything else found in the audit — nine defects, including a counter that never counts and a
time filter that filters nothing — **is still present on purpose.** This repository's value to the
assignment is as evidence of what one prompt and one generation produce with nobody in the loop,
and repairing the evidence would destroy it. The guardrail breaches were the exception, because a
prototype that contradicts its own stated constraints cannot be submitted as one that honours them.

## Files

| File | What it contains |
| --- | --- |
| `index.html` | Entry page with the `#root` mount point. No external resources. |
| `metadata.json` | App name and description. Declares no platform capabilities. |
| `package.json` | React 19 + TypeScript + Vite + Tailwind 4 dependencies, and the `dev` / `build` / `preview` / `lint` scripts. |
| `tsconfig.json` | TypeScript configuration. `npm run lint` runs `tsc --noEmit`. |
| `vite.config.ts` | Vite + React + Tailwind plugins. Module-preload polyfill disabled, so the bundle contains no `fetch` at all. |
| `src/main.tsx` | Mounts `<App />` into `#root` and loads the stylesheet. |
| `src/App.tsx` | Root component. Holds setup, filter and screen state, and switches between the three screens without reloading. |
| `src/types.ts` | Every shared type: `Ingredient`, `Meal`, `UserSetupState`, `RecommendationFilterState`, `MealMatchResult`. |
| `src/data.ts` | **All invented data:** 26 ingredients across five categories and 10 meals with quantities, servings, prep and cook times, calories, macros, difficulty, category, tags, instructions and a chef's tip. |
| `src/utils/mealMatcher.ts` | Pure logic: ingredient matching and match percentage, time and preference evaluation, filtering, sorting. |
| `src/components/Navbar.tsx` | Sticky header with brand, three step breadcrumbs and a reset control. |
| `src/components/MealSetup.tsx` | Screen 1. Ingredient search, category tabs, presets, chip grid, people / time / preference controls and the Find Meals button. |
| `src/components/MealRecommendations.tsx` | Screen 2. Setup summary, sort and filter controls, result count, meal cards and empty state. |
| `src/components/MealDetail.tsx` | Screen 3. Serving control, have / need ingredient lists, times, nutrition breakdown, instructions, chef's tip and back buttons. |
| `src/index.css` | Tailwind import, the palette as design tokens, and the base body style. Uses the platform's own sans — no webfont is fetched. |
| `PROMPTS.md` | Prompt log and artifact audit. |
| `REFLECTION.md` | Five-question build reflection. |
