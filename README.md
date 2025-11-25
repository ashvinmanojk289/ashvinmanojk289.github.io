# Ashvin Manoj Portfolio

A modern, single-page, responsive portfolio website showcasing AI/ML engineering, robotics, research, certifications, and key projects. This repository powers the GitHub Pages site for Ashvin Manoj.

## Live Site

If this repository is named `<username>.github.io` (it is), the site is automatically served at:

```
https://ashvinmanojk289.github.io
```

(If you fork: rename your fork to `<your-username>.github.io` or enable Pages via Settings > Pages.)

## Features

- Dark / Light theme toggle with persistent preference (localStorage)
- Dynamic typing effect ("Engineer", "Developer", etc.)
- Animated AI background (network-style canvas nodes with adaptive theme coloring)
- Custom cursor (desktop only; falls back gracefully on touch devices)
- Smooth page navigation with animated section transitions & heading animation
- Swipe navigation for mobile (left/right to change sections)
- Project filtering (category buttons) + expandable case study accordions
- Certifications & publications section with card layout
- GitHub stats panel (public repositories + recent activity via GitHub REST API)
- Resume preview with direct PDF download
- Contact form (integrated with Getform.io endpoint)
- Rule-based AI Assistant (in-page chatbot using a conversation tree)
- Accessibility-friendly semantics (ARIA labels, alt text, focusable controls) and progressive enhancements
- Downloadable vCard (`assets/ashvinmanoj.vcf`)

## Technology Stack

- Core: HTML5, CSS3 (custom variables & theming), Vanilla JavaScript (ES6+)
- Icons: [Ionicons 5.5.2 CDN]
- Fonts: Google Fonts (Poppins, Roboto)
- Hosting: GitHub Pages
- External API: GitHub REST API (public stats)
- Form backend: Getform.io

## Repository Structure

```
├── index.html          # Main HTML document, all sections embedded
├── style.css           # Theming, layout, animations, responsive styles
├── script.js           # Initialization & interactive modules
├── assets/             # Images, favicon, resume, vCard
│   ├── profile-dark.jpg
│   ├── profile-light.jpg (referenced conditionally by theme)
│   ├── resume.jpg
│   ├── resume.pdf
│   ├── ashvinmanoj.vcf
│   └── favicon.png
└── README.md           # Project documentation
```

## JavaScript Module Overview (`script.js`)

Initialization sequence (DOMContentLoaded):

1. `initPageNavigation()` – Activates SPA-like navigation via data attributes.
2. `initCaseStudyAccordion()` – Expand/collapse project case study details.
3. `initProjectFilter()` – Category-based project grid filtering.
4. `initCertAccordion()` – (Prepared for accordion behavior in certifications; currently static cards.)
5. `initLoadingSpinner()` – Graceful page load spinner removal (timeout fallback).
6. `initCustomCursor()` – Inertial cursor animation (desktop only).
7. `initTypingEffect()` – Cycles through descriptor words in the hero subtitle.
8. `initCurrentYear()` – Utility hook (placeholder for footer/year usage).
   --color-accent: #ff7a00;
   }
   html[data-theme="light"] {
   --color-accent: #d73b2f;
   }

````

### GitHub Stats Username
Change the `username` constant in `fetchGitHubStats()` if forking.
```js
const username = 'yourusername';
````

### Contact Form Endpoint

Replace the `action` attribute of the form with your Getform (or alternate) endpoint:

```html
<form
  action="https://getform.io/f/your-endpoint"
  method="POST"
  class="form"
  data-form
></form>
```

### vCard

Replace fields inside `assets/ashvinmanoj.vcf` with your details (FN, EMAIL, TEL, etc.).

### MOOC Certificates Grouping

The Certifications section separates high-signal courses (AI/ML + core Software Engineering) from supplementary ones:

- Major MOOCs: Advanced AI/ML, Generative AI, Prompt Engineering, LLM foundations, fundamental software engineering & algorithms.
- Additional MOOCs: Data analytics, robotics domain courses, industrial automation, or peripheral skill programs.

Structure in `index.html`:

```html
<ul id="major-moocs">
  <!-- always visible -->
  ...
</ul>
<button id="more-certs-btn">Show Additional MOOCs</button>
<ul id="additional-moocs" class="hidden">
  <!-- toggled -->
  ...
</ul>
```

Toggle logic lives in `initMoreCertsToggle()` inside `script.js`.

To reclassify:

1. Move `<li>` nodes between `#major-moocs` and `#additional-moocs`.
2. Keep 5–7 items in major for brevity.
3. Ensure `#additional-moocs` keeps the `hidden` class initially.
4. Avoid duplicating a course across both lists.

Add new items by copying the card HTML pattern used in existing `<li>` blocks. Maintain concise descriptions (≤ 2 sentences) and consistent skill labels.

## Running Locally

No build step required.
Option 1: Open `index.html` directly in a browser.
Option 2: Serve for cleaner relative path handling:

```powershell
# From repo root
powershell -Command "Start-Process powershell -Verb RunAs"  # (Optional admin shell)
# Simple server using npm 'serve' if Node is installed
npm install -g serve
serve .
# Or Python (if installed):
python -m http.server 8000
```

Navigate to `http://localhost:8000` (Python) or printed URL for `serve`.

## Deployment (GitHub Pages)

1. Repository name must be `<username>.github.io` (already satisfied).
2. Commit & push changes to `main`.
3. Pages auto-deploy; first publish can take a few minutes.
4. Custom domain (optional): Add `CNAME` file or configure in Settings > Pages.

## Performance & UX Notes

- Canvas animation throttles via basic frame interval & visibility API.
- Case study accordions limit open panels to reduce layout shifts.
- Custom cursor disabled on coarse pointers (mobile/tablet) for performance & usability.
- Minimal blocking scripts: Ionicons loaded via CDN modules; main script at bottom of body.

## Accessibility Considerations

- Semantic headings per section.
- `aria-label` usage on icon links.
- High-contrast accent colors per theme.
- Focus targets are standard interactive elements (no intrusive outline removal).
  Future Improvement: Add skip link, refine focus ring styling, ensure keyboard toggling for chat assistant button states.

## Security & Privacy

- Contact form posts directly to Getform: review Getform's retention policy if handling sensitive data.
- No external analytics scripts included; GitHub API calls are public data only.
- LocalStorage only stores `theme` choice; no PII.

## Roadmap / Potential Enhancements

- Blog engine integration (Markdown → static render or simple JSON feed)
- Accessibility audit (WCAG contrast & keyboard navigation refinements)
- Minify CSS/JS for faster PageSpeed scores
- Add service worker for offline caching (static assets)
- Integrate Open Source LLM (browser-run) for richer assistant beyond rule tree
- Lazy-load heavy sections when scrolled into view

## Contributing

This is a personal portfolio. Contributions are generally not accepted unless discussed. If you spot a bug:

1. Open an issue describing steps to reproduce.
2. (Optional) Submit a PR with a focused fix.

## License

No explicit license file is provided. All content (text, images, resume) is proprietary to Ashvin Manoj. If you fork, replace personal assets & text. Do not reuse resume, profile photos, or publication metadata without permission.

Ionicons: Licensed under MIT (via CDN). Google Fonts: SIL Open Font License (usage permitted).

## Contact

- Email: `ashvinmanojk@gmail.com`
- LinkedIn: https://www.linkedin.com/in/ashvinmanojk289
- GitHub: https://github.com/ashvinmanojk289

Feel free to reach out for collaboration, research, or professional opportunities.

---

Generated README to document structure, features, and customization of the portfolio site.
