# PantryPilot (AI Studio) — Build Reflection

**Author: Aaron Koo**

MGMT 6110 Human-AI Collaboration, Singapore Management University.

| | |
| --- | --- |
| Artefact | PantryPilot · React 19 + TypeScript + Tailwind 4, front end only |
| Repository | `Aaronkoo314/PantryPilot_AI_Studio` |
| Tool | Google AI Studio |
| Prompts in the build | **1** |
| Commits in the build | **2**, twenty-two seconds apart |
| Human decisions during the build | **0** |
| Companion build | `Aaronkoo314/pantrypilot` — the same prompt, run in Claude Code |

The last three figures are the spine of this document. The companion reflection records four human
decisions during its build; this one records none, and both numbers are literal rather than
rhetorical. Every figure, file path and ratio below comes from this repository and has been
re-checked against it. The clause-by-clause audit that supports the claims is in
[`PROMPTS.md`](PROMPTS.md).

This reflection is written as a comparison, because that is the only honest way to read a
single-generation artefact. On its own, this build looks like a success: it runs, it typechecks
clean, and it is the best-looking thing I produced in this course. Held against the same prompt run
in a different tool, it becomes something more useful — a controlled measurement of what
disappears when nobody is in the loop.

---

## Q1 — Who the users are, and what changes for them

**External, not internal, and identical to the companion build** — same users, because the same
GPT-generated prompt defined them, and that definition was not mine.

It was not the tool's opening position either. ChatGPT first proposed something too narrow (*"busy
university students and young professionals"*); I pushed back and overshot in the other direction
(*"目标用户是所有人群…从小白，到学生，到主妇到大厨"*); it refused mine, cited the assignment against it,
and produced a third definition — *non-professional home cooks, including beginners, students, busy
workers, parents, and experienced everyday cooks* — which went into the prompt verbatim and is
therefore the user definition in both repositories. Professional chefs were excluded with a stated
reason: their real job is recipe development and cost control, not deciding what to cook tonight.

🔑 **Neither party's opening definition would have produced this app.** The exchange is quoted in
full in [`PROMPTS.md` §1.3](PROMPTS.md#13-the-user-definition--where-it-was-wrong-first-then-i-was-then-it-was-right).

**How many.** Zero. This is a prototype with no users, and the honest number is one marker.

So Q1's interesting question is not *who* but *what actually differs for them between the two
builds*, given the same brief.

### What this build does better for them

The setup screen is materially easier to operate, and it was easier in the first generation.

A home cook standing at an open fridge has to tell the app what is in it. The companion build's
first version presented all thirty ingredients as one wall of chips: 2,930 pixels tall at a
375-pixel width, which put "how many people are eating?" two screenfuls below the fold. Fixing that
took an entire later batch of work.

AI Studio did not need to be told. Its first generation shipped a search box, five category tabs,
and three presets — **Common essentials** (16 of 26 ingredients flagged `suggestedPantry`),
**Select all**, and **Clear**. A cook with a normally stocked kitchen can express their pantry in
two taps instead of twenty-six decisions.

I did not ask for any of it. It is the clearest case in either build of the tool understanding the
user's situation better than I did.

### What this build takes away from them

Three of the promises made on that same screen are not kept:

| The screen says | What happens | Where |
| --- | --- | --- |
| A live count of matching meals on the Find Meals button | It reads `10` — the whole dataset — whatever the user ticks | [`PROMPTS.md` §4.1](PROMPTS.md#41--the-number-on-the-find-meals-button-never-changes) |
| "15 minutes / 30 minutes / 60+ minutes — how much time do you have?" | The answer is never applied to the results | [§4.2](PROMPTS.md#42--the-time-budget-chosen-on-screen-1-filters-nothing) |
| Recipe cards show a cooking time | Prep time is excluded, so a 15-minute card can be a 25-minute dish | [§5](PROMPTS.md#5-unspecified-choices-and-the-declaration-that-is-not-in-the-repository) |

The first two are the ones that matter. A person who says *I have fifteen minutes*, presses the
button and is shown a fifty-minute beef skillet has been answered correctly by the code and
falsely by the interface. For a product whose entire proposition is "help me decide in the next
sixty seconds", a time filter that does not filter is not a cosmetic bug — it is the feature.

### The honest limit, and the way this build makes it worse

Both builds share one structural limit: the app only works if the user first tells it what is in
the fridge. Neither removes the inventory step; both move it from the user's memory to the user's
thumbs and put it first, where it is most visible and most likely to be abandoned.

This build adds a specific twist. It boots with **seven ingredients already selected** — chicken,
eggs, garlic, rice, broccoli, olive oil, soy sauce ([`App.tsx:10`](src/App.tsx#L10)). The screen
therefore answers its own question before the user has said anything, and every ingredient-match
percentage on screen 2 is computed against a pantry that belongs to nobody. A user who does not
notice the pre-selection is shown a confident, precise and wholly fictional ranking — Golden Garlic
Egg Fried Rice at **71%** (5 of 7 ingredients), Seared Garlic Herb Chicken at **67%**, and eight
more below them, all of it measured against someone else's kitchen. And `Reset` returns to that same
pre-filled state, so the app has no way to express an empty kitchen.

Nobody decided this. It is seven strings in a default object, and it changes the product's opening
question from *what do you have?* to *here is what we assume you have.*

---

## Q2 — Augmented capacity and constrained capacity

### What the pairing let me do

**Speed, and a look I could not have specified.**

One paste, one generation, and a running React 19 + TypeScript application: 26 ingredients, 10
recipes with 60 instruction steps and 10 chef's tips, three screens, a working serving-scaling
model. `npm install` clean. `npx tsc --noEmit` clean, zero errors. Minutes, not hours — the
companion build took an evening and the following morning to reach a comparable state.

The visual result is the best of anything I made in this course, and it is better than what I would
have asked for. AI Studio put style choices in front of me before I had to invent a vocabulary for
them, so I was **choosing from options rather than specifying a palette** — and choosing is a much
easier cognitive task than describing. Warm off-white on olive, an emoji per ingredient, a chef's
tip per recipe, and a display serif over a geometric sans. I could not have written the prompt that
produces that. I recognised it immediately when shown it.

> ⚠️ **A correction I have to make in my own reflection, because it proves this document's point
> against me.** The sentence above originally named the pairing as *Playfair Display over Plus
> Jakarta Sans*, because that is what `index.html` requests. It is wrong.
> `grep -rn "serif\|Playfair" src/` returns nothing: **Playfair Display is applied to no element in
> the app.** It was fetched from Google's CDN on every page load and rendered nothing. Plus Jakarta
> Sans was real, but only as the first name in a fallback stack.
>
> So I praised a typeface pairing of which half never appeared on screen — and I did it by reading
> the markup instead of looking at the running app. That is the same failure this reflection
> attributes to itself in Q4 (*"I never sat down and used the thing I published"*), except here it
> produced a false claim in my own coursework rather than an unnoticed defect in the tool's output.
> The design praise stands for what actually rendered; the attribution of it does not.

In the companion build the palette had to be argued into existence over several turns and still
came out plainer. That is not a model-quality difference. It is a difference in what the tool asks
you for: one asked me to *pick*, the other asked me to *describe*.

Then it out-designed me on interaction as well (§Q1). Two wins, both in the first generation, both
outside what I specified.

### What the pairing narrowed

Five constraints. Each is anchored in this repository rather than borrowed from an article.

#### 1. Zero decisions, and the count is the finding

The companion build records four human decisions across its whole session: where the folder lives,
public or private, TypeScript or not, and whether to commit. Small decisions — but each was a
moment where the build stopped and asked.

This build records none. The platform chose the stack, the component boundaries, the repository,
its visibility, and the commit messages. `feat: initialize PantryPilot core architecture` is not a
sentence I wrote or reviewed. There was no moment at which the build paused and put something to
me, because a single generation has no moments in it.

I want to be careful about the direction of that claim. Four decisions is not a lot either. The
useful comparison is not *supervised versus unsupervised* — it is **four opportunities to look
versus none**, and what got through each.

#### 2. What I could not do was aim a change

This is the constraint I felt most, and it is a property of the tool rather than the model.

In Claude Code a change is *addressed*. I name a file and a line, the change lands there, and I can
read the diff. In AI Studio the unit of work is the application. Asking for one adjustment invites
a re-generation whose blast radius I cannot see in advance, which means I hesitate before asking —
and a tool you hesitate to ask is a tool you stop iterating with.

The cost curves are inverted:

|  | Turn 1 | Turn 10 |
| --- | --- | --- |
| **AI Studio** | cheapest — a finished-looking app in minutes | expensive — the unit of change is the whole app |
| **Claude Code** | expensive — hours of specification, argument and testing | cheapest — name the line |

Every one of the nine findings in [`PROMPTS.md` §4](PROMPTS.md#4-where-the-artifact-breaks-its-own-promises)
is a one-line fix in the companion build's idiom. §4.2, the disconnected time filter, is literally
one line. In the tool that produced it, none of them are one-line fixes, because there is no line to
point at — only a prompt to re-run.

So the tools are not competing on quality. **AI Studio is faster and prettier and harder to steer;
Claude Code is slower and plainer and precise.** The first is optimised for arriving; the second
for staying. I would now describe AI Studio as a tool for someone who wants a good-looking working
thing today and will accept what it chose, and Claude Code as a tool for someone who intends to
keep working on the thing and can read what it wrote. That reads like a statement about developer
seniority, and partly it is — but the operative variable is not skill. It is **whether you expect
to have a second turn.**

#### 3. No visible reasoning, so no audit trail

Ask this repository a simple product question: *why is Sizzling Garlic Butter Shrimp & Rice a
fitness meal when Golden Mushroom & Melted Cheese Omelette is not?*

It cannot answer. `fitnessSuitability` is ten hand-written booleans in `src/data.ts`. Ranking the
meals by protein per 100 kcal shows the flags do track a real signal and shows exactly how thin the
line is:

| g protein / 100 kcal | flag |
| --- | --- |
| 7.62 | `true` |
| **7.13** | **`true`** ← shrimp rice |
| **6.77** | **`false`** ← omelette |
| 6.35 | `false` |

The threshold sits in a 0.36-unit gap, stated nowhere, owned by nobody. The prompt's own sentence —
*higher in protein, lower in calories, nutritionally balanced* — is pasted into
[`mealMatcher.ts:47`](src/utils/mealMatcher.ts#L47) as a comment directly above a line that reads
the boolean back out. Three criteria collapsed into one flag, and the comment describes an
intention rather than the code beneath it.

The companion build hit the same wall. There, the question has an answer, because the tool was
interrogated mid-build and the answer was committed as
[`RANKING-RULES.md`](https://github.com/Aaronkoo314/pantrypilot/blob/main/RANKING-RULES.md): every
rule that ranks, scores or filters what a user sees, in plain English, with its weights and a named
human owner.

The point worth carrying: this artefact is not less explainable because the model is weaker. It is
less explainable because **there were no turns in which to ask, so no answers to keep.**
Explainability was not lost in the generation; it was never captured, and a single-shot workflow has
nowhere to put it.

#### 4. What I delegated, and did not check

| Delegated | Volume | Checked by a human before publication |
| --- | --- | --- |
| Ingredients | 26 of 26 | none |
| Recipes | 10 of 10 | none |
| Instruction steps | 60 | none |
| Nutrition figures | 50 (calories + 3 macros + servings × 10) | none |
| Chef's tips, tags, descriptions | 30 fields | none |
| Every colour token, every string of copy | all | none |
| Stack, dependencies, component boundaries | all | none |

I checked the nutrition afterwards. Applying 4 kcal/g for protein and carbohydrate and 9 kcal/g for
fat, all ten meals reconcile with their stated calories to within **2.6%**, the worst case being the
mushroom omelette at −8 kcal on 310. That is a good result — better than the companion build, where
9 of 11 meals initially disagreed with themselves because a per-serving figure was rounded before
being multiplied.

But it is a good outcome from no process, which is the least reproducible kind. I did not verify it;
I discovered it. Had it been wrong, it would have been wrong in a public repository with my name on
it, and the reason I would have found out is that someone else read it.

#### 5. Two guardrail breaches I would not have found by reading the code

`src/` is clean: no model calls, no fetches, no network. The breaches are entirely outside it —
`package.json`, `.env.example`, `metadata.json`, `index.html`. This is the subject of Q3, because it
is not really a constraint on capability. It is a constraint on where supervision has to be pointed.

Both breaches were repaired before submission, and only those two things were repaired; what
changed and what was left alone is logged in
[`PROMPTS.md` section 9](PROMPTS.md#9-remediation-log).

---

## Q3 — In, on, and out of the loop

### Out of the loop: the entire build

The plainest statement available about this repository is that **the human contribution to it is
upstream of it entirely.**

Everything I decided, I decided before the prompt existed: rejecting six product ideas the tool
proposed and substituting my own; the nine features in the one paragraph I actually wrote; the
argument about the audience, which I lost; and the guardrail that exists because a feature I asked
for was identified as a scope failure before it was built. All of it is documented and quoted in
[`PROMPTS.md` §1](PROMPTS.md#1-where-the-master-prompt-came-from), and all of it is genuinely mine
or genuinely a decision I made about someone else's suggestion.

**The prompt itself is not mine.** It was generated by ChatGPT, and I pasted it into AI Studio
without altering a word — including the two best features in this app, ingredient match percentage
and the serving-scale invariant, both of which it invented and neither of which was in my
paragraph. Being exact about that matters more to me than the alternative.

After the paste, I contributed nothing to this artefact until I began auditing it a day later.
Twenty-two seconds separate its two commits.

### On the loop, one day late

The audit in [`PROMPTS.md` §4](PROMPTS.md#4-where-the-artifact-breaks-its-own-promises) is me on the
loop. It found nine things, including a broken primary call to action and two guardrail breaches.

Being on the loop late is not the same as being on it. All nine shipped to a public repository
first. The audit's real function was not quality control — it was evidence collection, which is a
different job and does not help the user.

### Where I was in the loop and added nothing

I approved the publication. That is the one action in this build that was unambiguously mine, and I
performed it without reading `package.json`, `.env.example` or `metadata.json` — which is precisely
where the only real breach was.

### The finding I would keep if I could keep only one

The prompt contained a guardrail written specifically for this platform:

> **Do NOT call Gemini or any other AI model.**

It exists because, in the round-0 exchange that produced the prompt, a rejected product idea was
flagged with *"这次不能真的调用 AI，只能用 invented data"*. It is the most platform-aware line in
the whole prompt.

It is also the line this platform's own scaffold broke, in three files:

| Where | What |
| --- | --- |
| `package.json` | `"@google/genai": "^2.4.0"` |
| `.env.example` | `GEMINI_API_KEY`, documented as injected at runtime from user secrets |
| `metadata.json` | `"majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]` |

Plus a second breach of the adjacent guardrail — *do NOT call any external API, service, database,
or URL* — in the three requests to `fonts.googleapis.com` and `fonts.gstatic.com` that
[`index.html`](index.html#L12) makes on every page load.

**No code calls Gemini.** The behavioural intent of the guardrail holds. What does not hold is the
declaration: this app tells its host platform that it has a server-side Gemini capability, ships the
client library, and documents an API-key slot. An auditor checking this repository against its own
stated constraints finds a breach in the manifest and must read all of `src/` to discover it is
inert.

The lesson generalises past this build, and it is the one thing here I would say to an organisation:
**a prohibition in a prompt binds what the model writes. It does not bind the template the model
writes into.** Supervision aimed at generated code would not have caught this, because the generated
code is clean. It required reading the three files nobody reviews.

The companion build has the mirror-image version of this finding — a generated helper script that
carried the repository's only external URLs and its only real company name, in a project whose
guardrails forbade both. It was caught before submission, by an adversarial review turn that I
asked for. Same class of failure, same cause, different outcome, and the difference was a turn.

**This one is now fixed too, one day late rather than pre-emptively.** The dependency, the API-key
file, the declared capability and all three font requests are gone; the built app contains no
`fetch`, no `XMLHttpRequest`, no `WebSocket` and no third-party host, and
[`README.md`](README.md#how-to-verify-the-no-network-calls-claim-yourself) gives the one-line
command to check that. Nothing else in the artifact was touched. Repairing it does not undo the
finding — the finding is that it took an audit a day after publication to notice, and that no
automated signal available to me would have raised it.

### Where each step belongs, going forward

| Step | This build | Where it should be |
| --- | --- | --- |
| Product idea and user definition | out of the loop *(mine, upstream)* | **in** — unchanged, this is the part that worked |
| Prompt drafting | out of the loop *(mine, upstream)* | **in** |
| Code generation | out | **out** — correct. This is what the tool is for |
| Invented data (26 ingredients, 10 meals, 50 nutrition figures) | out | **on** — spot-check the arithmetic before publication, not after |
| Any rule that ranks, filters or scores what a user sees | out | **in** — a human states the rule and signs it (Q5.3) |
| Manifest, dependencies, environment surface | out | **in** — read against the guardrails before the first push (Q5.1) |
| Behavioural check of the primary flow | out | **in** — a named checklist, before "done" (Q5.2) |
| Publication to a public repository | in, but blind | **in**, with the file list actually read |

Four of the eight are wrong in this build, and all four are cheap to fix. None of the four is about
generating better code.

---

## Q4 — What it built that I never sketched

The full inventory of unrequested choices is
[`PROMPTS.md` §5](PROMPTS.md#5-unspecified-choices-and-the-declaration-that-is-not-in-the-repository).
Four of them changed the product rather than the code.

### 1. A persistent navbar — the confident addition that broke something

Nothing in the prompt asked for global navigation; it asked for three screens and a back button.
AI Studio built a sticky header with a brand block, three clickable step breadcrumbs and a reset
control. It is the most assured piece of interface design in the app.

It is also the source of a defect the specified design could not have had. `selectedMeal` is
initialised to `INVENTED_MEALS[0]` ([`App.tsx:27`](src/App.tsx#L27)) and the step-3 breadcrumb is
always live, so pressing **3. Detail** from the setup screen presents Golden Garlic Egg Fried Rice —
with a full have/need breakdown and a serving control — as though the user had chosen it.

**The unrequested feature is the one that broke.** Not because unrequested features are bad; because
this one introduced a navigation state that the three-screen flow had no defined behaviour for, and
there was no turn in which anyone noticed the gap.

### 2. A pre-ticked pantry

Covered in Q1. Seven default ingredients, no decision behind them, and the product's opening
question is inverted.

### 3. "Prioritize" read as "filter"

The prompt said the Fitness option *should only prioritize* higher-protein, lower-calorie, balanced
meals, and asked for *"fitness suitability"* as a data field. AI Studio implemented Fitness as a
filter: selecting it **removes** meals from the list rather than ranking them upward, and
`sortBy: 'match'` is untouched by preference.

⚠️ **I have to give this one back to the tool, though.** Re-reading the conversation that generated
the prompt, what it originally specified was a numeric field called **`fitnessScore`**, precomputed
per recipe, with the front end doing nothing but *"filter / rank"*. A number. That specificity did
not survive the compression into R·G·O·G·C, where it became *suitability* — a property a thing
either has or does not — and AI Studio implemented the word it was actually given. Ten hand-written
booleans is a faithful reading of "suitability" and an unfaithful reading of "score".

🔑 So the most unaccountable thing in this app — a threshold in a 0.36-unit gap that nobody can
point at ([§Q2.3](#3-no-visible-reasoning-so-no-audit-trail)) — was not caused by the model, by the
platform, or by the absence of a human in the loop. **It was caused by a lossy compression of a good
specification into a shorter one, in a document I pasted without reading closely enough.** The
companion build read "prioritize" as a ranking and derived it from the data, which is the better
outcome from the same defective input — but that is one tool getting lucky with an ambiguity, not a
process that protected me.

### 4. `chefTip` — the addition I would keep

Ten fields beyond the thirteen the prompt specified, one per recipe: *"Use chilled or day-old cooked
rice so grains separate cleanly in the hot pan."* It is the only text in either build that sounds
like a person who has actually cooked. Nothing asked for it and it is the best thing in the dataset.

### When I noticed

A day later, reading this repository's source in the other tool. **Not by using the app.** Every
finding in `PROMPTS.md` §4 came from reading code, not from clicking. That is the honest account of
my supervision here: I never sat down and used the thing I published.

### It decided things I did not know were decisions

- That "prioritize" could mean "filter".
- That a live count on a primary button could be decorative.
- That `'60'` could mean *sixty or more* on one screen and *sixty or less* on the next
  ([§4.4](PROMPTS.md#44--60-means-60-or-more-on-screen-1-and-60-or-less-on-screen-2)).
- That the nutrition disclaimer could describe invented numbers as *"calculated estimates"*
  ([§4.7](PROMPTS.md#47--the-disclaimer-describes-the-data-as-measured-rather-than-invented)) — the
  guardrail asked me to avoid presenting nutrition as medical advice, and the wording avoids that
  while quietly claiming the numbers were measured.

None of these arrived as questions. The prompt's final line asked for exactly this — *state any
choice I did not specify in one short line before implementing it* — and the repository contains no
record of any such statement. In the companion build that single instruction turned out to matter
more than any other line in the prompt.

### Where it was right and the supervised build was wrong

The serving-size control has to rescale ingredient quantities and total calories while leaving
calories per person fixed. AI Studio wrote:

```js
const totalCalories = Math.round(meal.caloriesPerServing * currentServings);
```

Multiplied, then rounded. Correct.

The companion build rounded the per-serving figure first and then multiplied it, so whole-dish
calories disagreed with whole-dish macros on 9 of its 11 meals. I only found it because I asked for
an adversarial review of the data — a turn I chose to spend.

**So the build with no human in the loop got the arithmetic right, and the build with a human in the
loop got it wrong.** I want that sentence in this document, because the rest of it argues for
supervision and this is the counterexample. Supervision did not make the numbers correct; it made
the error *findable*. Those are different claims, and only the second one is supported by these two
repositories.

---

## Q5 — Learning pointers for the organisational context

Four, each anchored to a specific finding in this repository rather than to a general principle.

### 1. Audit the manifest and the environment surface against the guardrails — before the first push, not the code

**Evidence.** `@google/genai` in `package.json`, `GEMINI_API_KEY` in `.env.example`, and
`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` in `metadata.json` — three files contradicting one
explicit prompt line, in an application whose `src/` directory is entirely clean. Plus three
external font requests in `index.html`, against a guardrail forbidding external URLs.

**The rule.** Before a generated repository becomes public, one person reads its dependency
manifest, every `.env*` file, and any platform metadata file **out loud against the stated
constraints.** Not the feature list, not the diff — those describe what the model wrote, and the
breach lives in what the model wrote *into*.

**Why it transfers.** This is a five-minute check, it requires no engineering judgment, and it is
the only check that would have caught the sole real breach in this build. Generation platforms ship
templates; templates are configured for the platform's business, not for your constraints. Assume
the scaffold has not read your guardrails, because it hasn't.

### 2. A clean compiler is not a review gate — write the behavioural check before you generate

**Evidence.** `npx tsc --noEmit` passes with **zero errors** on an application whose primary call to
action displays a number that never changes and whose stated time budget is disconnected from its
results. TypeScript verified everything about the code and nothing about the product.

**The rule.** Any single-generation artefact passes a **named behavioural checklist**, written
before the generation, before anyone calls it done. For a decision-support prototype the checklist
is three lines long:

1. Change each input and confirm every derived number on screen moves.
2. Set the most restrictive filter and confirm the result set shrinks.
3. Read the disclaimer aloud and ask whether it is true.

Line 1 catches [§4.1](PROMPTS.md#41--the-number-on-the-find-meals-button-never-changes). Line 2
catches [§4.2](PROMPTS.md#42--the-time-budget-chosen-on-screen-1-filters-nothing). Line 3 catches
[§4.7](PROMPTS.md#47--the-disclaimer-describes-the-data-as-measured-rather-than-invented). Total
cost: under two minutes, against nine findings that took a day to assemble afterwards.

**Why it transfers.** The seductive property of a generated app is that it *looks* finished, and
every automated signal available agrees — it installs, it compiles, it renders, it is pretty. None
of those signals can see a counter wired to nothing. The gate has to test behaviour, and it has to
be written down beforehand, because afterwards the artefact is persuasive.

### 3. Every generated value that decides what a user sees needs a stated rule and a named owner, committed beside the code

**Evidence.** `fitnessSuitability` — ten hand-written booleans, a threshold in a 0.36-unit gap
between 7.13 and 6.77 g protein per 100 kcal, no rule in the code, no note in the repository, and
nobody to ask. The prompt's three criteria are present only as a comment describing an intention the
code below it does not implement.

**The rule.** One plain-English sentence per rule that ranks, scores or filters, with its weights
and a human name, in a file in the repository. The companion build's
[`RANKING-RULES.md`](https://github.com/Aaronkoo314/pantrypilot/blob/main/RANKING-RULES.md) exists
for exactly this reason and is the artefact I would mandate. **If nobody will put their name to the
rule, the feature ships without it.**

**Why it transfers.** This app labels food as suitable for fitness. Scaled up, the same shape of
generated boolean decides which candidates surface, which transactions get flagged, which customers
see which price. The defect is not that a model chose the threshold — someone has to. The defect is
that the choice left no record, so it cannot be reviewed, challenged, corrected or defended.

### 4. Choose the tool by the number of turns you expect, not by the quality of turn one

**Evidence.** The cost curves in §Q2.2, and the nine findings. AI Studio produced a faster,
better-looking, better-designed first draft than the companion build did. Every defect in it is
cheap to fix in the other tool and expensive to fix in the one that made it, because there is no
line to address a change to — only a prompt to re-run.

**The rule.** Decide, before the first prompt, whether the artefact is a **demonstration** or a
**foundation.** If it exists to be shown this week — a pitch, a stakeholder demo, a concept to kill
or fund — generation-first wins outright and the speed and polish are worth more than the
auditability. If anyone will still be editing it in a month, it must be built somewhere a change can
be aimed at a line, even though turn one costs hours instead of minutes.

**Why it transfers.** Putting a demonstration tool on a product path is not a tooling mistake, it is
a planning mistake, and it is made before anyone types anything. The failure mode is
organisationally specific and very common: a generated demo impresses someone, the demo becomes the
plan, and then a team spends a quarter maintaining an artefact nobody can explain — with a
`fitnessSuitability` boolean somewhere in it that no one dares change.

---

## Further action

**This repository is preserved as generated, with one exception.** The two guardrail breaches were
repaired before submission — a prototype cannot be handed in as one that honours its constraints
while contradicting them in four files. Everything else in `PROMPTS.md` section 4 is still there on
purpose: the repository's value to this course is as evidence of what one prompt and one generation
produce with nobody in the loop, and repairing the evidence would destroy it. The companion
repository is where the product work continues.

### Already done — because they were breaches, not defects

| Fix | Cost | Status |
| --- | --- | --- |
| Remove `@google/genai`, `express`, `dotenv`, `motion`, the `GEMINI_API_KEY` file and the declared Gemini capability | Minutes | **Done.** Full log in [`PROMPTS.md` section 9](PROMPTS.md#9-remediation-log) |
| Eliminate all three external font requests | Minutes, not the thirty I expected — two of the three were for a face the app never used, and the third had a system fallback already declared | **Done.** The built app now contains no network-calling code at all |
| Rename the package from the scaffold's `react-example` | Seconds | **Done** |

Everything below is not done, and each line says what it would cost.

### Still outstanding, and the cheapest of them first

| Fix | Cost |
| --- | --- |
| Rewrite the nutrition disclaimer to say the data is invented rather than "calculated" | One line. It is the one remaining place where the app tells the user something untrue about itself |

### Then the three broken promises

| Fix | Cost |
| --- | --- |
| Make the Find Meals count reflect the actual filters | ~5 lines — pass the real filter state, or count the matched set |
| Apply the screen-1 time budget to the recommendation list | 1 line in `handleFindMeals` |
| Reconcile `'60'` between the two screens, and decide whether the card shows cooking or total time | ~10 lines, plus one product decision that is mine to make, not the tool's |

### Then the accountability gap

Write the equivalent of `RANKING-RULES.md`: derive `fitnessSuitability` from the dataset instead of
hard-coding it, state the threshold in plain English, and put a name on it. Then decide whether
Fitness ranks or filters — the prompt said *prioritize*, the code filters, and only a human can
settle which the product should do.

### Then the interface debt

Replace `#7A7870` for text under 14 px (currently 3.95:1 on cards, against a 4.5:1 requirement), give
the six failing palette pairs enough contrast, restore a visible focus ring on the navbar logo,
raise the 40 px steppers to 48 px, and label the icon-only controls — there are 7 `aria-*` or `role`
attributes across roughly 61 KB of components.

### Not doing

- **Making it match the companion build feature-for-feature.** Two builds of the same brief are more
  useful than two copies of one build.
- **Fixing the pre-ticked pantry quietly.** If it is fixed, it should be fixed as a stated product
  decision about what the app assumes on first run — which is the kind of choice this whole
  reflection argues should have a human name against it.
