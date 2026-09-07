# PantryPilot (AI Studio) — Prompt Log

**Author: Aaron Koo**

MGMT 6110 Human-AI Collaboration, Singapore Management University.
Build: 7 September 2026. Tool: **Google AI Studio**.
Companion build in Claude Code: <https://github.com/Aaronkoo314/pantrypilot>

---

## What this log is, and what it cannot be

The sibling repository's [`PROMPTS.md`](https://github.com/Aaronkoo314/pantrypilot/blob/main/PROMPTS.md)
is a chronological log of a long build: seventeen numbered incidents, most of them failures.
**This log cannot be that document, because this build was not that kind of build.**

The same master prompt was pasted into Google AI Studio once. One generation produced the whole
app. The git history is two commits twenty-two seconds apart:

```
f6947e4  2026-09-07 16:11:43 +0800  feat: initialize PantryPilot core architecture
e5ad4b2  2026-09-07 16:11:21 +0800  Initial commit
```

I did not preserve the AI Studio session, so I do not have a turn-by-turn record of it, and
**I am not going to reconstruct prompts I no longer hold.** Inventing a plausible sequence of
follow-up prompts would be the easiest section of this assignment to write and the least true
thing in it.

What I do hold is the prompt itself and the artifact it produced. So this log is built the other
way round from its sibling: section 1 is the prompt, and sections 3 to 6 audit the artifact
against it, clause by clause, with a file and line number behind every claim. Everything in those
sections is checkable by anyone with this repository. Where I am inferring rather than verifying,
the text says so.

**Where the failures are.** A prompt log has to record what went wrong, not only what worked. With
one generation there are no failed follow-up prompts to record, so the failures in this log live in
three places, all of them real: [§4](#4-where-the-artifact-breaks-its-own-promises) is nine defects
in what was produced, [§8](#8-where-the-prompt-itself-went-wrong) is the rounds of drafting that
went wrong plus the seven clauses of the final prompt that failed *in this build*, and
[§9](#9-remediation-log) records what I had to change afterwards and why.

Entries are marked as in the sibling log:

| Mark | Meaning |
| --- | --- |
| ✅ | The prompt was satisfied |
| ⚠️ | The prompt was not satisfied, or the artifact contradicts itself |
| 🔑 | A finding that changes how I would run the next build |

---

## 1. The prompt

The prompt is unchanged from the sibling build — the same text, not one word altered. Its
four-round origin (drafted by ChatGPT from a product idea of mine, with the public transcript
linked) is documented in
[§1 of the sibling log](https://github.com/Aaronkoo314/pantrypilot/blob/main/PROMPTS.md#1-where-the-master-prompt-came-from)
and is not repeated here. **The final wording is not mine.**

One line in it matters more here than it did there:

> **CONTEXT:** Individual front-end prototype for MGMT 6110 at SMU. **Built in Google AI Studio**,
> stored in GitHub, deployed on Vercel.

🔑 The prompt was written *for this platform*. The sibling repository is that prompt run somewhere
it was never addressed to; this repository is the prompt run where it was aimed. That inverts the
usual expectation about which build should have followed it more faithfully — and section 4 shows
the expectation was wrong.

The prompt in full, as pasted:

> **ROLE:** You are a senior front-end developer building a clean, mobile-friendly React web app.
>
> **GOAL:** Build the front end of a cooking assistant called PantryPilot for non-professional
> home cooks, including beginners, students, busy workers, parents, and experienced everyday cooks.
>
> The main job of the product is to help users decide what to cook based on what ingredients
> they currently have, how many people they are cooking for, how much time they have, and what
> kind of meal they want.
>
> Build three connected screens:
>
> **1) Meal Setup** — select ingredients from an invented list; choose number of people; choose
> available cooking time (15 / 30 / 60+ minutes); choose a meal preference (Regular, Quick & Easy,
> Fitness, Family Meal); a clear "Find Meals" button.
>
> **2) Meal Recommendations** — at least 6 invented meal cards, each showing meal name, ingredient
> match percentage, cooking time, servings, calories per person, difficulty, meal category, and
> missing ingredients. Filter or sort by cooking time, calories, ingredient match, meal preference.
> An option to show only meals that require no additional ingredients. Clicking a meal opens its detail.
>
> **3) Meal Detail** — full ingredient list marking what the user has and still needs; preparation,
> cooking and total time; calories per serving and total; protein, carbohydrates and fat; a
> serving-size control that rescales ingredient quantities and total calories while leaving calories
> per person unchanged; step-by-step instructions; a button back to the recommendations.
>
> **OUTPUT:** A running React web app. All invented data in one separate data file. At least
> 20 invented ingredients and 8 invented meals. Each meal with structured data for ingredients,
> quantities, servings, cooking time, preparation time, calories per serving, protein, carbohydrates,
> fat, difficulty, meal category, and fitness suitability. One component per major screen or section.
> Movement between screens without reloading the page. Fully usable on a mobile phone.
> When finished, list all files created and briefly explain what each contains.
>
> **GUARDRAILS:** Front end only. Invented data only. Do NOT call Gemini or any other AI model.
> Do NOT call any external API, service, database, or URL. Do NOT add a backend. Do NOT add login,
> accounts, authentication, analytics, cloud storage, payments, grocery delivery, barcode scanning,
> camera recognition, or live nutrition services. Do NOT use real restaurant, food-delivery, grocery
> or company names, logos or trademarks. Do NOT add features that are not listed. Do NOT present
> nutritional information as medical advice. The Fitness option should only prioritize meals that
> are relatively higher in protein, lower in calories, and nutritionally balanced within the
> invented dataset.
>
> **CONTEXT:** Individual front-end prototype for MGMT 6110 at SMU. Built in Google AI Studio,
> stored in GitHub, deployed on Vercel. Primary users are non-professional home cooks. The visual
> style should feel modern, warm, practical and food-focused rather than technical or corporate.
>
> If you make any design or implementation choice that I did not explicitly specify, state that
> choice in one short line before implementing it.

### The one trace of the prompt left inside the repository

There is no README, no session export and no build log in this repository. The prompt survives in
it in exactly two places, both worth recording because they show prompt vocabulary hardening into
code:

- [`metadata.json`](metadata.json) carries a compression of the GOAL paragraph as the app's
  description: *"Smart everyday cooking assistant helping home cooks decide what to cook with
  on-hand ingredients, cooking time, and meal preferences."*
- The two data exports in [`src/data.ts`](src/data.ts) are named **`INVENTED_INGREDIENTS`** and
  **`INVENTED_MEALS`**. The word "invented" appears four times in the prompt as a constraint on
  *me*; the tool promoted it into the public identifiers of the data layer. Every component that
  imports data therefore imports the guardrail's vocabulary too.

---

## 2. What the generation delivered

Verified by reading the repository at commit `f6947e4`, and by running the toolchain.

| | |
| --- | --- |
| Framework | React 19.0.1 + TypeScript 5.8, Vite 6, Tailwind CSS 4 |
| Also pulled in | `lucide-react` (icons), `motion` (animation), `express`, `dotenv`, `@google/genai` |
| Screens | 3, plus an unrequested persistent navbar |
| Components | 4 — `MealSetup` (20.3 KB), `MealDetail` (19.8 KB), `MealRecommendations` (17.2 KB), `Navbar` (3.7 KB) |
| Logic | `src/utils/mealMatcher.ts` (4.2 KB), `src/types.ts` (1.9 KB) |
| Data | `src/data.ts` — 26 ingredients, 10 meals, 24 KB, one file |
| `npm install` | ✅ clean |
| `npx tsc --noEmit` | ✅ clean, zero errors |

✅ It runs, and it typechecks. The visual result is the most finished-looking thing I produced in
this course: a Playfair Display / Plus Jakarta Sans pairing, a warm off-white and olive palette,
an emoji per ingredient, a chef's tip per recipe.

⚠️ It typechecks *and* ships a counter that always displays the same number (§4.1), a time budget
that filters nothing (§4.2), and a dependency the guardrails forbade (§4.6). See §5.

---

## 3. Clause-by-clause audit of the prompt

### ROLE and CONTEXT

| Clause | Result | Evidence |
| --- | --- | --- |
| Clean, mobile-friendly React web app | ✅ mostly | Responsive Tailwind classes throughout; but touch targets are 40 px (`w-10 h-10` steppers in [MealDetail.tsx:163](src/components/MealDetail.tsx#L163)) and the navbar breadcrumbs about 32 px tall, both under the 44–48 px guidance |
| "modern, warm, practical and food-focused rather than technical or corporate" | ✅ | Delivered better than the sibling build, in my judgment. This is the clause AI Studio won on. |
| Built in Google AI Studio | ✅ | And the scaffold left its fingerprints — see §5 |

### Screen 1 — Meal Setup

| Clause | Result | Evidence |
| --- | --- | --- |
| Select ingredients from an invented list | ✅ | 26 ingredients, 5 categories, plus unrequested search and category tabs |
| Choose number of people | ✅ | Stepper, default 2 |
| Choose cooking time (15 / 30 / 60+) | ✅ present, ⚠️ inert | Options render correctly ([MealSetup.tsx:42](src/components/MealSetup.tsx#L42)); the value never reaches the recommendation filter — §4.2 |
| Choose a meal preference (4 named options) | ✅ | Exactly the four names from the prompt, in `src/types.ts` |
| A clear "Find Meals" button | ✅ button, ⚠️ badge | The button carries a live count that is always `10` — §4.1 |

### Screen 2 — Meal Recommendations

| Clause | Result | Evidence |
| --- | --- | --- |
| At least 6 invented meal cards | ✅ 10 | `INVENTED_MEALS` |
| Card shows name, match %, cooking time, servings, calories/person, difficulty, category, missing ingredients | ✅ all eight | `MealRecommendations.tsx` |
| Filter or sort by cooking time, calories, ingredient match, meal preference | ✅ present, ⚠️ two semantic faults | §4.3 and §4.4 |
| Option to show only meals needing no extra ingredients | ✅ | `onlyNoMissing`, [mealMatcher.ts:79](src/utils/mealMatcher.ts#L79) |
| Clicking a meal opens its detail | ✅ | `handleSelectMeal` |

### Screen 3 — Meal Detail

| Clause | Result | Evidence |
| --- | --- | --- |
| Ingredient list marking have / still need | ✅ | Two-column split against `selectedIngredientIds` |
| Prep, cooking and total time | ✅ | All three shown here — unlike the card, which shows cooking time only |
| Calories per serving and total | ✅ | Both tiles present |
| Protein, carbohydrates, fat | ✅ present, ⚠️ mislabelled block | §4.5 |
| Serving control rescales quantities and total calories, per-person calories unchanged | ✅ **and correct** | `scaleRatio` at [MealDetail.tsx:43](src/components/MealDetail.tsx#L43); `totalCalories = Math.round(caloriesPerServing * currentServings)` at [:46](src/components/MealDetail.tsx#L46) — multiplied *then* rounded, which is the order the sibling build got wrong and I had to catch by hand |
| Step-by-step instructions | ✅ | 6 steps per meal, all ten meals |
| A button back to the recommendations | ✅ | Plus a second route back via the navbar |

### OUTPUT

| Clause | Required | Delivered | Result |
| --- | --- | --- | --- |
| Invented ingredients | ≥ 20 | 26 | ✅ |
| Invented meals | ≥ 8 | 10 | ✅ |
| All invented data in one separate file | 1 file | `src/data.ts` | ✅ |
| Structured meal fields | 13 named fields | all 13, including `fitnessSuitability` | ✅ |
| One component per major screen **or section** | — | 4 components; no separate card, filter bar or ingredient picker | ⚠️ partial. Screens yes, sections no: `MealSetup.tsx` is 20 KB and holds the hero, presets, search, tabs, chip grid, three control groups and the footer bar. The sibling build split the same surface into eight components. |
| Movement between screens without reloading | — | `useState` screen switch in `App.tsx` | ✅ |
| Fully usable on a mobile phone | — | responsive, but 40 px targets | ⚠️ partial |
| **"When finished, list all files created and briefly explain what each contains."** | — | no such list anywhere in the repository | ⚠️ If it was produced in the AI Studio chat, it did not survive into the artifact, which is the only place a reader can check. |

### GUARDRAILS

*This table records the state **as generated**, at commit `f6947e4`. Two of these breaches were
repaired before submission; [§9](#9-remediation-log) says exactly what changed and why the rest was
deliberately left alone.*

| Guardrail | Result |
| --- | --- |
| Front end only | ⚠️ `express` and `dotenv` are dependencies; `package.json` has a `clean` script that deletes `server.js` |
| Invented data only | ✅ |
| **Do NOT call Gemini or any other AI model** | ⚠️ **breached at the manifest level** — §4.6 |
| **Do NOT call any external API, service, database, or URL** | ⚠️ **breached** — three requests to `fonts.googleapis.com` / `fonts.gstatic.com` on every page load, [index.html:12–14](index.html#L12) |
| No backend | ⚠️ none implemented, but `express` + `dotenv` + `APP_URL` are staged for one |
| No login, accounts, analytics, cloud storage, payments, delivery, barcode, camera, live nutrition | ✅ none present |
| No real restaurant, delivery, grocery or company names, logos or trademarks | ⚠️ arguable. No food brands. But `metadata.json` names a Google product capability and `index.html` hard-codes two Google hostnames. |
| Do NOT add features that are not listed | ⚠️ several added — §5 |
| Do NOT present nutrition as medical advice | ✅ with a wording problem — §4.7 |
| Fitness must only prioritize higher-protein, lower-calorie, balanced meals within the dataset | ⚠️ implemented as an unexplained hand-written boolean, and as a filter rather than a priority — §4.8 |
| **Declare every unspecified design or implementation choice** | ⚠️ nothing in the repository records any such declaration — §5 |

---

## 4. Where the artifact breaks its own promises

Nine findings. Each was found by reading this repository's source in Claude Code *after* it was
published, which is itself the finding of §Q3 in [`REFLECTION.md`](REFLECTION.md).

### 4.1 ⚠️ The number on the Find Meals button never changes

The primary call to action carries a live count badge. It reads **10 — the total number of meals in
the dataset — no matter what the user does.** Tick nothing: 10. Tick fourteen ingredients: 10.
Choose 15 minutes and Fitness: 10.

[`MealSetup.tsx:123`](src/components/MealSetup.tsx#L123) calls `filterAndSortMeals` with every
filter set to its neutral value:

```js
{ sortBy: 'match', maxTimeFilter: 'all', preferenceFilter: 'all', onlyNoMissing: false }
```

`filterAndSortMeals` ([mealMatcher.ts:56](src/utils/mealMatcher.ts#L56)) then skips all three of its
filter steps and returns the full array. The `useMemo` recomputes on every keystroke, correctly,
and always arrives at the same answer. Rendered at
[`MealSetup.tsx:485`](src/components/MealSetup.tsx#L485).

🔑 The sibling build shipped **the same defect, in the same place, on the same button** — logged as
[§2.14 "The counter that never counted"](https://github.com/Aaronkoo314/pantrypilot/blob/main/PROMPTS.md#214-the-counter-that-never-counted).
Two different tools, given the same prompt, independently produced a live counter wired to
nothing. The difference is that in the sibling build I found it before submission by clicking the
button; here I found it a day later by reading the code. Nothing about *that* difference was skill —
it was that the other build had a testing turn and this one had no turns at all.

### 4.2 ⚠️ The time budget chosen on screen 1 filters nothing

`handleFindMeals` ([App.tsx:42](src/App.tsx#L42)) copies the user's meal *preference* into the
filter state, and does not copy the time preference:

```js
if (setupState.mealPreference !== 'Regular') {
  setFilterState((prev) => ({ ...prev, preferenceFilter: setupState.mealPreference }));
}
// timePreference is never written to filterState.maxTimeFilter
```

`maxTimeFilter` stays at its default `'all'`. A user who says "I have 15 minutes", presses Find
Meals and is shown a 50-minute beef skillet has been answered honestly by the code and dishonestly
by the interface. The remedy is one line; the point is that nobody was in the loop to notice.

### 4.3 ⚠️ Two booleans computed on every render and read by nothing

`evaluateMealFitness` ([mealMatcher.ts:31](src/utils/mealMatcher.ts#L31)) returns `isTimeFit` and
`isPreferenceFit`. They are attached to every `MealMatchResult` and typed in `src/types.ts`.
`grep -rn "isTimeFit\|isPreferenceFit" src/components/` returns nothing. No component reads either
value; `filterAndSortMeals` does not filter on them.

So the function that decides whether a meal fits the user's stated time and preference runs ten
times per render and its answer is discarded. This is what §4.2 looks like from the other end: the
tool built the mechanism *and* built the filter, and never connected them.

### 4.4 ⚠️ `'60'` means "60 or more" on screen 1 and "60 or less" on screen 2

Same token, opposite meanings, two screens apart:

- [`MealSetup.tsx:44`](src/components/MealSetup.tsx#L44) — `{ id: '60', label: '60+ minutes', desc: 'Slow simmers & baking' }`
- [`MealRecommendations.tsx:162`](src/components/MealRecommendations.tsx#L162) — `<option value="60">Extended (≤ 60 minutes)</option>`
- [`mealMatcher.ts:39`](src/utils/mealMatcher.ts#L39) — for `isTimeFit`, `'60'` maps to `999`, i.e. unbounded
- [`mealMatcher.ts:85`](src/utils/mealMatcher.ts#L85) — for the actual filter, `parseInt('60')` caps at 60

The dataset's longest cooking time is 45 minutes, so no user can currently be harmed by it. It is
recorded because it is the shape of defect that becomes a bug the moment someone adds a roast.

### 4.5 ⚠️ "Based on N servings" heads a block in which four of five figures are per-person

On the detail screen the nutrition section header reads *"Based on {currentServings}
servings"* ([MealDetail.tsx:211](src/components/MealDetail.tsx#L211)). Inside it, Total Calories
scales with the stepper; Protein, Carbohydrates and Fat do not — they are per-serving figures
printed unscaled. Each tile does carry a small "per person" caption, so a careful reader is safe.
The header still asserts something about the block that is true of one tile in five.

### 4.6 ⚠️ A Gemini API surface, in a build whose guardrails named Gemini specifically

Three artifacts, all in the repository, all contradicting one line of the prompt:

| Where | What |
| --- | --- |
| [`package.json`](package.json) | `"@google/genai": "^2.4.0"` as a runtime dependency |
| [`.env.example`](.env.example) | `GEMINI_API_KEY="MY_GEMINI_API_KEY"`, described as injected at runtime from user secrets |
| [`metadata.json`](metadata.json) | `"majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]` |

`grep -rn "genai\|GoogleGenAI\|GEMINI" src/` returns nothing. **No code calls Gemini.** The
guardrail's behavioural intent — invented data only, no model calls — holds in the running app.

What does not hold is everything around it: the app *declares* a server-side Gemini capability to
its host platform, ships the client library, and documents an API-key slot. Anyone auditing this
repository against its own guardrails finds a breach in the manifest and has to read all of `src/`
to discover the breach is inert.

#### And three external requests, two of them for nothing

The adjacent guardrail — *do NOT call any external API, service, database, or URL* — was breached
more plainly, in [`index.html`](index.html): two `preconnect` hints and one stylesheet request to
`fonts.googleapis.com`, which then pulls font files from `fonts.gstatic.com`. Every page load
reached Google before it rendered a pixel, in an app whose data is entirely local.

One detail makes this worse and is worth recording on its own. The stylesheet requested **two**
families, Plus Jakarta Sans and Playfair Display. `grep -rn "serif\|Playfair" src/` returns
nothing: **Playfair Display is applied to no element anywhere in the app.** It was fetched on every
load, for every visitor, and rendered nothing.

⚠️ I had also praised that typeface pairing in my own reflection, having read `index.html` rather
than looked at the running app. Half of the pairing I admired never existed on screen. That error
was mine, not the tool's, and it is corrected in [`REFLECTION.md`](REFLECTION.md) §Q2 — where it
turns out to be a small, exact demonstration of that document's own argument about reviewing code
instead of using the product.

🔑 This is the single most useful thing this build taught me, and it is in
[`REFLECTION.md`](REFLECTION.md) §Q5 as the first learning pointer. **The guardrail was written for
this platform, and this platform's scaffold is what broke it.** A prohibition in a prompt binds
what the model writes. It does not bind the template the model writes into. The sibling build's
equivalent finding — a stray generated file carrying the repository's only external URLs and its
only real company name — was caught before submission; this one shipped, because the scaffold is
not something a reviewer thinks to read.

### 4.7 ⚠️ The disclaimer describes the data as measured rather than invented

[`MealDetail.tsx:273`](src/components/MealDetail.tsx#L273):

> \* Note: Nutritional values are calculated estimates for everyday home cooking and are not
> intended as medical advice.

The "not medical advice" half satisfies the guardrail. The first half does not survive contact with
the truth: these are not calculated estimates, they are numbers a language model made up. The only
place the running app admits the data is fictional is an empty-state string on screen 2 —
*"None of our invented recipes match…"* ([MealRecommendations.tsx:343](src/components/MealRecommendations.tsx#L343)) —
which a user only ever sees when the app has failed to help them.

For contrast, the sibling repository states it in the README and on two screens: *"Nutrition figures
are illustrative sample data for a prototype."*

### 4.8 ⚠️ `fitnessSuitability` is a hand-written boolean with no stated rule

The prompt was specific: Fitness should *"only prioritize meals that are relatively higher in
protein, lower in calories, and nutritionally balanced within the invented dataset."*

The implementation is a literal `true` / `false` typed into each of the ten meal objects in
`src/data.ts`. Nothing derives it. The prompt's sentence is pasted into
[`mealMatcher.ts:47`](src/utils/mealMatcher.ts#L47) as a comment, directly above a line that reads
the boolean back out:

```js
} else if (preference === 'Fitness') {
  // Fitness option prioritizes meals relatively higher in protein, lower in calories, nutritionally balanced
  isPreferenceFit = meal.fitnessSuitability;
}
```

Ranking the ten meals by protein per 100 kcal shows the flags do track a real signal — and shows
where the unwritten threshold sits:

| g protein / 100 kcal | flag | Meal |
| --- | --- | --- |
| 13.03 | `true` | Seared Garlic Herb Chicken & Broccoli |
| 11.69 | `true` | Zesty Mediterranean Tuna & Egg Bowl |
| 9.86 | `true` | Cozy Homestyle Chicken & Veggie Soup |
| 7.62 | `true` | Crispy Golden Tofu & Garden Stir-Fry |
| **7.13** | **`true`** | **Sizzling Garlic Butter Shrimp & Rice** |
| **6.77** | **`false`** | **Golden Mushroom & Melted Cheese Omelette** |
| 6.35 | `false` | Hearty Rustic Beef & Potato Skillet |
| 4.10 | `false` | Skillet Cheesy Potato & Egg Hash |
| 3.79 | `false` | Creamy One-Pan Tomato Spinach Pasta |
| 3.66 | `false` | Golden Garlic Egg Fried Rice |

The line is drawn in a 0.36-unit gap, by nothing anyone can point at. There is no threshold in the
code, no note in the repository, and no human who decided it. A user asking "why is the shrimp rice
a fitness meal and the omelette not?" cannot be answered from this repository.

Two further gaps against the prompt's wording:

- **"Prioritize" was implemented as a filter, not a priority.** Selecting Fitness *removes* meals
  from the list rather than ranking them up. `sortBy: 'match'` is unaffected by preference.
- **"Lower in calories" and "nutritionally balanced" are not represented at all** — a single
  boolean cannot carry three criteria, and only one of the three is even loosely traceable in it.

The sibling build hit this same wall and the fix became a committed document,
[`RANKING-RULES.md`](https://github.com/Aaronkoo314/pantrypilot/blob/main/RANKING-RULES.md), which
states each weight in plain English and names a human owner for it. That document exists because
of this exact problem. This repository has no equivalent.

### 4.9 ⚠️ Two navigation states that present things the user never chose

- **The pantry starts pre-ticked.** `DEFAULT_SETUP` ([App.tsx:10](src/App.tsx#L10)) selects seven
  ingredients — chicken, eggs, garlic, rice, broccoli, olive oil, soy sauce — before the user has
  said anything. The first screen a home cook sees therefore answers its own question, and every
  match percentage on screen 2 is computed against a pantry they did not enter. `handleReset`
  returns to this state rather than to an empty one, so "reset" cannot produce an empty pantry.
- **The breadcrumb opens a recipe nobody selected.** `selectedMeal` is initialised to
  `INVENTED_MEALS[0]` ([App.tsx:27](src/App.tsx#L27)) and the navbar's step-3 button is always
  live ([Navbar.tsx](src/components/Navbar.tsx)). Pressing "3. Detail" from the setup screen
  presents Golden Garlic Egg Fried Rice, with a full have/need breakdown, as though it were a
  recommendation. The navbar is itself an unrequested feature (§5), which makes this the clearest
  case in the build of an added feature creating a defect the specified features did not have.

### 4.10 ⚠️ Contrast and focus

Computed from the palette tokens in the source, using the WCAG 2.1 relative-luminance formula.
Not verified in a rendered browser, so treat these as arithmetic on the committed values.

| Pair | Ratio | AA for normal text (4.5:1) |
| --- | --- | --- |
| `#7A7870` on `#F5F2EA` (secondary text on cards) | 3.95:1 | fails |
| `#7A7870` on `#FDFCF9` (secondary text on page) | 4.31:1 | fails |
| `#7A7870` on `#FFFFFF` (navbar subtitle, breadcrumbs) | 4.42:1 | fails |
| `#B85737` on `#FDF1ED` (the 11 px "Calories / Person" label) | 4.26:1 | fails |
| `white/70` on `#4A6D4B` ("Entire batch" caption) | 3.81:1 | fails |
| `white/80` on `#4A6D4B` ("Total Calories" label) | 4.44:1 | fails |
| `#A6A49C` on `#FFFFFF` (breadcrumb chevrons) | 2.50:1 | fails 3:1 for non-text too |
| `#242320` on `#FDFCF9` (body) | 15.32:1 | passes |

`#7A7870` is the workhorse secondary colour and most of its uses are at 10 px or 11 px, which is
the worst combination available: the smallest type in the app is in the colour that fails hardest.

Separately, [`Navbar.tsx:19`](src/components/Navbar.tsx#L19) applies `focus:outline-none` to the
logo button with no replacement ring, so keyboard focus there is invisible. Across roughly 61 KB of
components there are **7** `aria-*` or `role` attributes in total, and the icon-only controls are
largely unlabelled.

---

## 5. Unspecified choices, and the declaration that is not in the repository

The prompt's last line:

> If you make any design or implementation choice that I did not explicitly specify, state that
> choice in one short line before implementing it.

In the sibling build this instruction mattered more than any other and produced
[§4 of that log](https://github.com/Aaronkoo314/pantrypilot/blob/main/PROMPTS.md#4-unspecified-choices-and-who-really-made-them).
Here, **nothing in the repository records any such declaration.** Whether AI Studio made them in
the chat I can no longer check, and I will not claim either way. What I can do is reconstruct the
list from the artifact, because an unspecified choice leaves evidence whether or not it was
announced.

| Choice | Specified? | What it changed |
| --- | --- | --- |
| React 19, TypeScript, Tailwind 4 | No — prompt said "React web app" | Reasonable; TypeScript is a real gain over the sibling build's plain JSX |
| `motion` animation library added | No | An unused-looking dependency in a "front end only, nothing not listed" build |
| `express` + `dotenv` | No | Staging for a backend the guardrails forbade |
| **Persistent navbar with clickable breadcrumbs** | No | The most visible addition, and the cause of §4.9's second half |
| Seven ingredients pre-selected on load | No | Changes the product's opening question from *what do you have* to *here is what we assume* |
| "Common essentials" / "Select all" / "Clear" presets | No | Genuinely good; `suggestedPantry` on 16 of 26 ingredients is a design idea I did not have |
| Ingredient search box and category tabs | No | Good; the sibling build needed a whole v2 batch to arrive at the same conclusion |
| `chefTip`, `shortDescription`, `tags`, per-item `emoji`, `commonUnit` | No | Five fields beyond the thirteen the prompt listed |
| Reset button | No | Returns to the pre-ticked default, not to empty (§4.9) |
| Fitness as a filter rather than a ranking | No — prompt said "prioritize" | §4.8. A one-word interpretation that changed the feature's nature |
| Card shows cooking time only; prep and total appear on the detail screen | Ambiguous — prompt asked for "cooking time" on the card | A 15-minute card can be a 25-minute dish. Two meals in the dataset are exactly this. |
| Google Fonts from a CDN | No — and forbidden | §4.6 |
| Scaffold identity left in place: `package.json` name `react-example`, version `0.0.0` | No | Tells a reader this was generated and never adopted. Renamed during remediation — [§9](#9-remediation-log) |

🔑 The pattern: the additions I would keep (presets, search, category tabs, TypeScript) are all
*setup-screen ergonomics* — exactly the area the sibling build had to rework in a later batch. The
additions that cost me are all *state and platform* choices: the navbar, the pre-ticked pantry, the
scaffold. AI Studio was a better designer than I gave it credit for and a worse engineer than its
clean typecheck suggests.

---

## 6. Index of findings

| # | Finding | Severity | Evidence |
| --- | --- | --- | --- |
| 4.1 | Find Meals count is always 10 | User-visible, misleading | `MealSetup.tsx:123`, `mealMatcher.ts:56` |
| 4.2 | Screen-1 time budget filters nothing | User-visible, misleading | `App.tsx:42` |
| 4.3 | `isTimeFit` / `isPreferenceFit` computed, never read | Dead logic | `mealMatcher.ts:31` |
| 4.4 | `'60'` means both "60+" and "≤ 60" | Latent | `MealSetup.tsx:44`, `MealRecommendations.tsx:162` |
| 4.5 | "Based on N servings" over per-person macros | Labelling | `MealDetail.tsx:211` |
| 4.6 | Gemini dependency, key surface and declared capability | **Guardrail breach** | `package.json`, `.env.example`, `metadata.json` |
| 4.6 | Three external font requests per page load | **Guardrail breach** | `index.html:12–14` |
| 4.7 | Invented data described as "calculated estimates" | Honesty | `MealDetail.tsx:273` |
| 4.8 | `fitnessSuitability` boolean with no stated rule or owner | **Unaccountable ranking** | `data.ts`, `mealMatcher.ts:47` |
| 4.9 | Pantry pre-ticked; breadcrumb opens an unchosen recipe | User-visible | `App.tsx:10`, `App.tsx:27` |
| 4.10 | Six palette pairs below 4.5:1; invisible focus ring; 7 aria attributes | Accessibility | `index.css`, all components |
| §3 | No file listing produced, though the prompt asked for one | Process | absent |
| §5 | No record of any declared unspecified choice | Process | absent |

**Two rows were fixed; the rest were not.** The two guardrail breaches were repaired before
submission, because a prototype that contradicts its own stated constraints cannot honestly be
handed in as one that honours them. Everything else is preserved as generated, because this
repository's value to the assignment is as evidence of what one prompt and one generation produce
with nobody in the loop, and repairing the evidence would destroy it. What changed is logged in
[§9](#9-remediation-log); the argument for leaving the rest alone is in
[`REFLECTION.md`](REFLECTION.md).

---

## 7. The two builds, side by side

Same prompt, same day, same author. Everything below is from the two repositories, not from memory.

| | **AI Studio** (this repo) | **Claude Code** ([sibling](https://github.com/Aaronkoo314/pantrypilot)) |
| --- | --- | --- |
| Prompts | 1 | Dozens, over about 14 hours |
| Commits in the build | 2, 22 seconds apart | Many, across two days |
| Stack | React 19 + TypeScript + Tailwind 4 | React 18 + plain JSX + hand-written CSS |
| Components | 4 | 8 |
| Data | 26 ingredients, 10 meals | 30 ingredients, 11 meals |
| Typechecks clean | ✅ | n/a — no TypeScript |
| Serving-scale calorie rounding | ✅ correct first time | ⚠️ wrong; caught by adversarial review |
| Find Meals counter | ⚠️ broken, shipped | ⚠️ broken, caught and fixed before submission |
| Time budget applied to results | ⚠️ no | ✅ yes |
| Fitness implemented as | a hand-written boolean, no rule | a score derived from the dataset's nutrition, documented in `RANKING-RULES.md` |
| External network calls | 3 per page load | none |
| Gemini / API-key surface | present, unused | none |
| Nutrition data internally consistent | ✅ within 2.6% on 4/4/9 | ✅ after a fix; 9 of 11 meals were wrong first |
| Contrast failures at submission | 6 palette pairs | 4 fill colours + 4 tokens, all fixed pre-submission |
| Documents in repo | these two, written afterwards | 4, written during |
| Human in the loop | upstream of the prompt only | throughout |
| Time to a running first draft | minutes | hours |
| Visual style offered up front | several, and I picked from them | none; the palette was argued into existence over several turns |
| Visual quality, my judgment | better | plainer |
| Cost of changing something after the first draft | high — re-generation, and hard to aim at one part | low — name the file, name the line |
| Who it suits | someone who wants a good-looking working thing today | someone who intends to keep working on it |

🔑 Neither column is the better build. The right reading is narrower and more useful: **the two
tools failed in different places, and the one difference that explains most of the gap is not model
quality but whether there was a turn in which a human could look.** Both produced a broken counter.
Only one of them had a moment where someone pressed the button.

The experiential comparison — AI Studio faster and better-looking but awkward to steer once
generated, Claude Code slower and more laborious but precise, personalisable and better suited to
someone who can read what it wrote — is the subject of
[`REFLECTION.md`](REFLECTION.md) §Q2.

---

## 8. Where the prompt itself went wrong

A prompt log has to record the prompts that went wrong. This build had one prompt, so there are no
failed follow-ups to log — but that does not mean nothing went wrong with the prompting. It means
the failures are in two other places, and both are recoverable without inventing anything.

### 8.1 The drafting rounds that went wrong

The master prompt took four rounds in ChatGPT before it existed, and two of those rounds were
failures. They govern this build as much as the companion one, because it is the same prompt. The
full transcript is public and linked from
[section 1 of the companion log](https://github.com/Aaronkoo314/pantrypilot/blob/main/PROMPTS.md#1-where-the-master-prompt-came-from);
these are the two that failed.

**⚠️ Round 0 — the tool's product recommendation was wrong, and I overrode it.**
I uploaded the assignment brief and asked only whether it could be read. What came back was six
candidate products — a book-discovery app, an investment watchlist, a gym-buddy matcher, a
study-sprint planner, a restaurant picker, a retail stock dashboard — with a recommendation:

> "如果是我替你选，我会直接做 BookPath。"

🔑 I took none of the six. I replied with an idea of my own: an app where you say what is in your
fridge and it tells you what you can cook. Every screen in *both* repositories descends from that
override. This is the single place in either build where the product came from a person, and it
came from rejecting the tool's advice rather than refining it.

**⚠️ Round 2 — my own prompt was wrong, and the tool was right to refuse it.**
I pushed for the widest possible audience:

> "目标用户是所有人群，所以覆盖面要广，从小白，到学生，到主妇到大厨都可以使用"

It refused, and cited the assignment against me: a weak product definition starts with an
over-broad user. It narrowed to non-professional home cooks and cut professional chefs explicitly,
on the grounds that their real job is recipe development and cost control, not deciding what to
cook tonight. I accepted, and that wording is verbatim in the GOAL section of the prompt that
produced this repository. **It is the one round where the human was overruled and the output
improved.**

### 8.2 The clauses of the final prompt that failed in this build

This is the new material, and it is the part specific to this repository. Seven clauses of the
prompt did not survive contact with this generation. In each case the tool did roughly what the
words allowed, and the words allowed too much.

| # | The clause | What it produced | Why the wording permitted it |
| --- | --- | --- | --- |
| 1 | "The Fitness option should only **prioritize** meals that are relatively higher in protein, lower in calories, and nutritionally balanced" | A hand-written boolean that *filters* ([4.8](#48--fitnesssuitability-is-a-hand-written-boolean-with-no-stated-rule)) | "Prioritize" reads unambiguous and is not — it can mean rank or select. Three criteria were allowed to collapse into one flag because the clause never said the score had to exist |
| 2 | "One component per major screen **or section**" | 4 components, one of them 20 KB ([3](#output)) | "Or section" made the harder half optional |
| 3 | "each showing meal name, ingredient match percentage, **cooking time**…" | Cards show cooking time; prep time is excluded, so a 15-minute card can be a 25-minute dish | I named the field I wanted displayed and never said what question it had to answer |
| 4 | "Do NOT call Gemini or any other AI model. Do NOT call any external API, service, database, or URL." | Clean `src/`, breached manifest ([4.6](#46--a-gemini-api-surface-in-a-build-whose-guardrails-named-gemini-specifically)) | It constrains *calls*. Dependencies, environment files and platform metadata are not calls |
| 5 | "If you make any design or implementation choice that I did not explicitly specify, **state that choice**" | No record survives in the repository ([5](#5-unspecified-choices-and-the-declaration-that-is-not-in-the-repository)) | "State" is satisfied by saying it once, in a chat window that is now gone |
| 6 | "When finished, **list all files created** and briefly explain what each contains" | No such list anywhere ([3](#output)) | Same failure as 5, same cause: an instruction to *say* something rather than to *write* it |
| 7 | "choose available cooking time (15 / 30 / **60+** minutes)" | `'60'` means "60 or more" on screen 1 and "60 or less" on screen 2 ([4.4](#44--60-means-60-or-more-on-screen-1-and-60-or-less-on-screen-2)) | The option was defined once, for one screen, and reused on another without its meaning |

Four of the seven I would now write differently, and the rewrites are short:

| Clause | How I would write it now |
| --- | --- |
| 1 · Fitness | "Derive a numeric fitness score for each meal from its own data — protein per calorie and calories per serving — and sort by that score when Fitness is selected. Do not store a hand-written suitability flag. Write the formula, in words, into a file in the repository." |
| 3 · Time | "Show total time on the card. Show the prep / cook split only on the detail screen. Filter and sort on the same figure the card displays." |
| 5 · Choices | "…state that choice in one short line **and append it to a file called `DECISIONS.md` in the repository.**" |
| 6 · File list | "…and write that list into `README.md`." |

🔑 The pattern across 5 and 6 is worth more than either finding on its own. **Both instructions
asked the tool to *tell me* something, and both were satisfied in a medium that did not survive.**
In the companion build they worked, because that session was itself the log. Here they produced
nothing, and their failure is the direct cause of this document having to be written as an audit
rather than a log. An instruction to explain is only as durable as the place the explanation lands —
which is why both rewrites above end in a filename.

### 8.3 The clause that was never there at all

The three defects that would matter most to a real user — a counter that always reads 10, a time
budget that filters nothing, a section header that contradicts its own tiles — are not
disobedience. **I never asked for the behaviour they get wrong.**

Read the prompt again with that in mind. It specifies in detail *what each screen displays*: nine
fields on the recommendation card, seven elements on the detail screen, four filter dimensions. It
specifies exactly one behaviour — that per-person calories stay fixed while the serving control
rescales everything else — and that is the one derived value the generation got right, first time,
in both builds.

Nowhere does it say the count on the button must reflect the filters. Nowhere does it say the time
budget chosen on screen 1 must constrain the results on screen 2. Those sentences are not in the
prompt, so their absence from the app is not a failure to comply.

🔑 **The prompt described an interface and almost never described what any of it meant.** That is
the prompting lesson I would carry into the next build ahead of anything about role, tone or
formatting: for anything a screen *derives* rather than *displays*, state the invariant. One
sentence — *"every count, percentage and filtered list on screen must change when any input that
feeds it changes"* — would have closed 4.1, 4.2 and 4.5 at once, and cost eighteen words.

---

## 9. Remediation log

**7 September 2026.** After the audit above, two things had to change. Everything else did not.

### What was changed, and why

The prompt's guardrails said *do NOT call Gemini or any other AI model* and *do NOT call any
external API, service, database, or URL.* As generated, the repository broke both. A prototype
cannot be handed in as one that honours its constraints while contradicting them in four files, so
the breaches were repaired:

| Change | File | Reason |
| --- | --- | --- |
| Removed `@google/genai` | `package.json` | The client library for the one model the guardrails named |
| Removed `express`, `dotenv`, `@types/express` | `package.json` | Staging for a backend, against "front end only" |
| Removed `motion` | `package.json` | Unused in `src/`; against "do NOT add features that are not listed" |
| Deleted the file | `.env.example` | Its only contents were `GEMINI_API_KEY` and `APP_URL`, both unused |
| `majorCapabilities` emptied | `metadata.json` | It declared `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` to the host platform |
| Removed all three font requests | `index.html` | The app's only external network calls. Two of the three were for Playfair Display, which is applied to no element in the app |
| Font stack made local-only | `src/index.css` | Stops naming a webfont that can no longer load; the app now uses the platform's own sans |
| `modulePreload: {polyfill: false}` | `vite.config.ts` | The polyfill was the only `fetch(` in the bundle. Removing it makes "no network calls" verifiable with one `grep` |
| Restored a corrupted em dash in a comment | `vite.config.ts` | A mangled byte from the AI Studio export |
| Renamed from `react-example` to `pantrypilot-ai-studio` | `package.json` | Scaffold identity, recorded as a finding in [section 5](#5-unspecified-choices-and-the-declaration-that-is-not-in-the-repository) |

**No application logic, no data and no interface code was touched.** Every one of the ten meals,
twenty-six ingredients and fifty nutrition figures is exactly as generated, and so is every
component.

### Verification

```
$ npx tsc --noEmit
(clean)

$ npm run build
built in 2.99s

$ grep -rE "fetch\(|XMLHttpRequest|WebSocket|sendBeacon" dist/
(nothing)
```

The JavaScript bundle went from 268.81 kB to 268.10 kB — a 0.71 kB difference, all of it the
removed preload polyfill. **Removing four dependencies changed the shipped bundle by nothing at
all**, which is its own small finding: `@google/genai`, `express`, `dotenv` and `motion` were never
imported, so they were never bundled. They were pure manifest weight — installed on every
`npm install`, declared to the host platform, and invisible in the artifact. That is exactly why
reviewing the generated *code* would never have found them.

Three URL strings survive in `dist/` and none of them is a request: Tailwind's MIT licence banner
inside a CSS comment, four W3C XML namespace *identifiers* used by SVG and MathML, and the
documentation URL React prints inside a minified error message. They are listed with explanations
in [`README.md`](README.md#how-to-verify-the-no-network-calls-claim-yourself).

### What was deliberately not fixed

All nine defects in [section 4](#4-where-the-artifact-breaks-its-own-promises) except the guardrail
breaches. The counter still always reads 10. The time budget still filters nothing. The breadcrumb
still opens a recipe nobody chose. `fitnessSuitability` is still ten hand-written booleans with an
unstated threshold.

That is the point of the repository. Its use to this assignment is as evidence of what one prompt
and one generation produce with nobody in the loop, and a repaired artifact is not evidence of
anything. The fixes, their cost and their ordering are set out in the further-action section of
[`REFLECTION.md`](REFLECTION.md#further-action).
