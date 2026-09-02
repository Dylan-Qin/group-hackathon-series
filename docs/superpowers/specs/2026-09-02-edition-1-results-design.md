# Edition 1 Results and Edition 2 Preview

## Purpose

Close the first DSL Hackathon with a durable public announcement of its award results, and make clear that the next edition is planned for Q4 2026.

## Scope

### Homepage (`index.html`)

- Replace the stale current-edition copy for Hackathon #1 with an upcoming-edition preview: **DSL Hackathon #2 · Q4 2026**.
- Use only the confirmed information: Q4 2026 and that details will follow. Do not invent dates, location, theme, or registration links.
- Retain Hackathon #1 in the editions archive and mark its card as completed.

### Edition 1 detail page (`editions/1.html`)

- Add an **Award Results** section after the event introduction.
- Present three equal **Best Project Award** recipients selected by the joint vote:
  - FragmentIsles — 贺天琦
  - paperpulse-skill — 陈梓兴
  - whyamihere — 李笑寒
- Present a distinct **Most Popular Project** award:
  - streaming-complete-notifier — 蔡旭
  - Explain that it is determined by GitHub stars.
- Do not display individual judges’ scores or a winner ranking.
- Replace first-edition registration and project-submission calls to action with a clear completed/submissions-closed state, while leaving project browsing available.

## Visual and Interaction Design

- Keep the site’s existing charcoal, warm-gold, and pale-text visual system.
- Use a responsive grid of three matching Best Project cards, each showing project name, recipient name, and award label.
- Use a separate highlighted Most Popular Project card with a star icon and the GitHub-star criterion.
- On narrow screens, award cards stack into one column without horizontal overflow.
- Do not add new JavaScript or network dependencies; this update is static HTML and CSS plus the current site behavior.

## Verification

- Confirm award names, project names, and recipient names appear exactly as approved.
- Confirm no stale claim says Hackathon #1 is currently accepting entries.
- Confirm the homepage announces Q4 2026 without unconfirmed event details.
- Check the two HTML files for valid local links and render the pages at desktop and mobile widths.
