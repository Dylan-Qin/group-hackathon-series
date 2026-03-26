# DSL Hackathon Series

A multi-format hackathon program by [DSL (Data Intelligence for Scientific Innovation Lab)](https://www.bigdatamining.cn/), designed to help students master modern AI tools, build real products, and turn ideas into prototypes.

## Current Edition

**DSL Hackathon #1 (April 2026)**

- **Date:** April 06 — 19, 2026
- **Location:** DSL 511
- **Theme:** Enhancing Research Efficiency with Generative AI
- **Participants:** DSL Members

The inaugural DSL Hackathon focuses on leveraging generative AI tools — such as Claude Code, NotebookLM, Nano Banana, OpenClaw, and Agent Skills — to enhance research efficiency and productivity.

## Features

- Dark/light theme toggle with gold-accent design
- Particle network canvas background animation
- Custom pixel cursor with trail effects
- Scroll-reveal animations and counter animations
- Background music with toggle control
- Fully responsive layout
- Edition detail pages with project carousel (infinite auto-scroll)
- Project submission system with GitHub API enrichment (avatar, description, stars, language)
- Time-gated submissions (only open during hackathon period)
- "All Projects" modal with full submission details
- GitHub Actions workflows for submission processing and metadata enrichment

## Project Structure

```
group-hackathon-series/
├── index.html                          # Main landing page
├── favicon.svg                         # Site favicon
├── editions/
│   └── 1.html                          # Edition #1 detail page
├── assets/
│   ├── css/style.css                   # Global styles
│   ├── js/main.js                      # All JavaScript logic
│   ├── audio/fever.mp3                 # Background music
│   └── img/                            # Edition images
│       ├── edition1-img1.png
│       └── edition1-img2.png
├── data/
│   └── editions/
│       └── 1/
│           └── submissions.json        # Edition #1 project submissions
├── .github/
│   └── workflows/
│       ├── jekyll-gh-pages.yml         # GitHub Pages deployment
│       ├── process-submission.yml      # Submission processing
│       └── enrich-submissions.yml      # GitHub API metadata enrichment
└── README.md
```

## Links

- [CNIC DSL](https://www.bigdatamining.cn/)
- [SciHorizon](https://www.scihorizon.cn/)
- [SciMatrix](https://www.scimatrix.cn/)
- [NanoAgent Team](https://nanoagentteam.github.io/)

