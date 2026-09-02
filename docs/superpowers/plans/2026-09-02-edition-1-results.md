# Edition 1 Results and Edition 2 Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Publish the first hackathon’s award results and make the Q4 2026 second-edition preview the homepage’s current event.

**Architecture:** Keep the site static. index.html becomes the Q4 preview and retains a completed Edition 1 archive card. editions/1.html gains semantic award-result markup and a completed-event state; assets/css/style.css supplies the responsive award-card layout. A Node built-in test protects confirmed wording and prevents closed calls to action from returning.

**Tech Stack:** HTML5, CSS3, existing vanilla JavaScript, Node.js built-in test runner (node --test).

## Global Constraints

- Keep English as the primary page language; retain winners’ Chinese names exactly: 贺天琦, 陈梓兴, 李笑寒, 蔡旭.
- Publish only confirmed information for Edition 2: Q4 2026 and “Details coming soon”.
- Best Project Award recipients are equal winners; do not publish scores, ranks, or a judges’ breakdown.
- Most Popular Project is streaming-complete-notifier and is determined by GitHub stars.
- Preserve the existing charcoal, warm-gold, and pale-text design system; add no packages, assets, JavaScript, or network requests.
- Edition 1 must no longer show active preregistration or project-submission controls; project browsing stays available.

---

### Task 1: Add regression coverage for the announcement content

**Files:**
- Create: tests/edition-results.test.mjs

**Interfaces:**
- Consumes: index.html, editions/1.html, and assets/css/style.css as UTF-8 text files.
- Produces: node --test tests/edition-results.test.mjs with one passing subtest per page concern.

- [ ] **Step 1: Write the failing test**

~~~js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('homepage promotes the confirmed Q4 2026 second edition', async () => {
  const homepage = await read('../index.html');
  const current = homepage.match(/<section class="section current" id="current">([\s\S]*?)<\/section>/)?.[1];

  assert.ok(current, 'current edition section exists');
  assert.match(current, /DSL Hackathon[\s\S]*?#2[\s\S]*?Q4 2026/);
  assert.match(current, /Details coming soon/);
  assert.doesNotMatch(current, /April 20 — May 05, 2026/);
  assert.match(homepage, /DSL Hackathon #1[\s\S]*?Completed/);
});

test('edition 1 lists all confirmed awards and has no active entry controls', async () => {
  const edition = await read('../editions/1.html');

  for (const recipient of [
    'FragmentIsles — 贺天琦',
    'paperpulse-skill — 陈梓兴',
    'whyamihere — 李笑寒',
    'streaming-complete-notifier — 蔡旭',
  ]) assert.match(edition, new RegExp(recipient));

  assert.match(edition, /Award Results/);
  assert.match(edition, /Best Project Award/);
  assert.match(edition, /Most Popular Project/);
  assert.match(edition, /[Dd]etermined by GitHub stars/);
  assert.match(edition, /Submissions Closed/);
  assert.doesNotMatch(edition, /id="preRegBtn"/);
  assert.doesNotMatch(edition, /id="submitProjectBtn"/);
});

test('award presentation has responsive styling hooks', async () => {
  const styles = await read('../assets/css/style.css');

  assert.match(styles, /\.award-results__grid/);
  assert.match(styles, /\.award-card--popular/);
  assert.match(styles, /@media \(max-width: 768px\)[\s\S]*?\.award-results__grid/);
});
~~~

- [ ] **Step 2: Run the test to verify it fails**

Run: node --test tests/edition-results.test.mjs

Expected: FAIL because the test file does not yet exist.

- [ ] **Step 3: Add the test file unchanged**

Create tests/edition-results.test.mjs with the code from Step 1. Do not modify production files in this task.

- [ ] **Step 4: Run the test to verify it fails for the missing feature**

Run: node --test tests/edition-results.test.mjs

Expected: FAIL in all three subtests because Edition 2 copy, the award block, and award CSS selectors do not yet exist.

- [ ] **Step 5: Commit the failing regression test**

~~~bash
git add tests/edition-results.test.mjs
git commit -m "test: cover hackathon results announcement"
~~~

### Task 2: Publish the homepage preview and Edition 1 results

**Files:**
- Modify: index.html:205-294
- Modify: editions/1.html:186-274
- Modify: assets/css/style.css after the current-edition rules and before edition-detail responsive rules

**Interfaces:**
- Consumes: the static-text tests from Task 1.
- Produces: semantic .award-results, .award-results__grid, .award-card, and .award-card--popular markup styled by CSS.

- [ ] **Step 1: Update index.html current-edition copy**

Replace the four stale Edition 1 detail cells with one confirmed timeline cell, and point the button at the completed event. The result must include:

~~~html
<span class="section__label reveal-up">Upcoming Edition</span>
<h2 class="current__title reveal-up" style="--delay: 0.1s">
  DSL Hackathon <span class="text-gold">#2</span> (Q4 2026)
</h2>
<p class="current__desc reveal-up" style="--delay: 0.2s">
  The next DSL Hackathon is coming in Q4 2026. Details coming soon — stay tuned for the theme, schedule, and registration information.
</p>
<div class="current__details reveal-up" style="--delay: 0.3s">
  <div class="current__detail">
    <span class="current__detail-label">When</span>
    <span class="current__detail-value">Q4 2026</span>
  </div>
  <div class="current__detail">
    <span class="current__detail-label">Status</span>
    <span class="current__detail-value">Details coming soon</span>
  </div>
</div>
<a href="editions/1.html#award-results" class="btn reveal-up" style="--delay: 0.4s">
  <span>View Edition 1 Results</span>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</a>
~~~

Change the archive title to DSL Hackathon #1 — Completed and its metadata badge to Completed. Keep the editions/1.html link and Apr–May 2026 date.

- [ ] **Step 2: Add results and closed-state markup to editions/1.html**

Insert this after the existing introduction and before the event details:

~~~html
<section class="award-results reveal-up" id="award-results" style="--delay: 0.15s" aria-labelledby="awardResultsTitle">
  <div class="award-results__header">
    <span class="section__label">Edition 1 · Final Results</span>
    <h2 class="edition-detail__section-title" id="awardResultsTitle">Award Results</h2>
    <p>Selected through our joint vote, these projects stood out for their creativity, execution, and research impact.</p>
  </div>
  <div class="award-results__grid">
    <article class="award-card">
      <span class="award-card__eyebrow">Best Project Award</span>
      <h3>FragmentIsles — 贺天琦</h3>
      <p>Congratulations on this achievement.</p>
    </article>
    <article class="award-card">
      <span class="award-card__eyebrow">Best Project Award</span>
      <h3>paperpulse-skill — 陈梓兴</h3>
      <p>Congratulations on this achievement.</p>
    </article>
    <article class="award-card">
      <span class="award-card__eyebrow">Best Project Award</span>
      <h3>whyamihere — 李笑寒</h3>
      <p>Congratulations on this achievement.</p>
    </article>
  </div>
  <article class="award-card award-card--popular">
    <span class="award-card__icon" aria-hidden="true">★</span>
    <div>
      <span class="award-card__eyebrow">Most Popular Project</span>
      <h3>streaming-complete-notifier — 蔡旭</h3>
      <p>Determined by GitHub stars.</p>
    </div>
  </article>
</section>
<div class="edition-detail__closed reveal-up" style="--delay: 0.3s">
  <span class="edition-detail__closed-icon" aria-hidden="true">✓</span>
  <div>
    <h2 class="edition-detail__section-title">Submissions Closed</h2>
    <p>Hackathon #1 has concluded. Thank you to everyone who participated — browse all submitted projects above.</p>
  </div>
</div>
~~~

Remove both legacy preregistration and project-submission blocks, including their buttons and external issue link.

- [ ] **Step 3: Style the award and closed-state components in assets/css/style.css**

~~~css
.award-results { margin: 4rem 0; }
.award-results__header { max-width: 42rem; margin-bottom: 2rem; }
.award-results__header p { color: var(--text-muted); line-height: 1.8; }
.award-results__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.award-card { padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; background: var(--bg-card); }
.award-card__eyebrow { color: var(--gold); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
.award-card h3 { margin: 0.75rem 0; font-size: 1.125rem; }
.award-card p { color: var(--text-muted); font-size: 0.875rem; line-height: 1.6; }
.award-card--popular { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; border-color: rgba(192, 174, 127, 0.55); background: rgba(192, 174, 127, 0.08); }
.award-card__icon, .edition-detail__closed-icon { color: var(--gold); font-size: 1.5rem; }
.edition-detail__closed { display: flex; gap: 1rem; align-items: flex-start; margin-top: 3rem; padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; background: var(--bg-card); }
@media (max-width: 768px) { .award-results__grid { grid-template-columns: 1fr; } .award-card--popular, .edition-detail__closed { align-items: flex-start; } }
~~~

- [ ] **Step 4: Run the static regression suite**

Run: node --test tests/edition-results.test.mjs

Expected: PASS with three passing subtests.

- [ ] **Step 5: Commit the announcement feature**

~~~bash
git add index.html editions/1.html assets/css/style.css
git commit -m "feat: publish edition 1 award results"
~~~

### Task 3: Verify rendered desktop and mobile pages

**Files:**
- Verify: index.html
- Verify: editions/1.html
- Verify: assets/css/style.css

**Interfaces:**
- Consumes: the static site and passing Node test suite from Task 2.
- Produces: a manual visual check at 1440px and 390px widths with no layout regressions.

- [ ] **Step 1: Serve the static site locally**

Run: python3 -m http.server 4173 --directory .

Expected: terminal reports Serving HTTP on 0.0.0.0 port 4173.

- [ ] **Step 2: Inspect homepage at desktop and mobile widths**

Open http://127.0.0.1:4173/index.html at 1440px and 390px widths. Confirm the Q4 2026 preview is legible, the detail grid does not leave an awkward empty area, and the completed archive badge remains readable.

- [ ] **Step 3: Inspect the Edition 1 awards at desktop and mobile widths**

Open http://127.0.0.1:4173/editions/1.html#award-results at 1440px and 390px widths. Confirm three Best Project cards fit in a row on desktop, stack in one column on mobile, the Most Popular card is visually distinct, and the page exposes no preregistration or submission action.

- [ ] **Step 4: Re-run automated verification and whitespace checks**

Run: node --test tests/edition-results.test.mjs && git diff --check && git status --short --branch

Expected: three passing tests, no git diff --check output, and a clean working tree ahead of origin/main by the documentation/test/feature commits.

- [ ] **Step 5: Commit only if visual verification requires a correction**

~~~bash
git add index.html editions/1.html assets/css/style.css tests/edition-results.test.mjs
git commit -m "fix: refine awards announcement layout"
~~~

Do not create this commit when no correction is needed.
