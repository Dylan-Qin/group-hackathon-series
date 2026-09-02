import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
  const edition = await read('../editions/1.html');
  const styles = await read('../assets/css/style.css');

  const awards = edition.match(/<section class="award-results[\s\S]*?<\/section>/)?.[0];

  assert.ok(awards, 'award results section exists');
  assert.match(awards, /<div class="award-results__grid">[\s\S]*?award-card--popular[\s\S]*?<\/div>\s*<\/section>/);
  assert.doesNotMatch(awards, /award-card__icon/);
  assert.match(styles, /\.award-results__grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, 1fr\)/);
  assert.match(styles, /\.award-card\s*\{[\s\S]*?min-height:\s*11.75rem/);
  assert.match(styles, /\.award-card--popular/);
  assert.doesNotMatch(styles, /\.award-card__icon/);
  assert.match(styles, /@media \(max-width: 768px\)[\s\S]*?\.award-results__grid/);
});

test('pages cache-bust the shared stylesheet with its content hash', async () => {
  const [homepage, edition, styles] = await Promise.all([
    read('../index.html'),
    read('../editions/1.html'),
    read('../assets/css/style.css'),
  ]);
  const version = createHash('sha256').update(styles).digest('hex').slice(0, 12);

  assert.match(homepage, new RegExp(`href="assets/css/style\\.css\\?v=${version}"`));
  assert.match(edition, new RegExp(`href="\\.\\./assets/css/style\\.css\\?v=${version}"`));
});
