# Trần Ngọc Huy — Portfolio

Personal portfolio of **Trần Ngọc Huy**, Java Backend Developer.

## Tech
- Vite + React 19
- React Three Fiber / drei / three.js: the 3D workstation scene is built entirely in code (no model files)
- GSAP + ScrollTrigger: scroll-driven camera poses, pinned horizontal "Work" section, reveals
- Formspree for the contact form

## Structure
```
├── index.html
├── public/              ← photo, client project screenshot & preview video
├── src/
│   ├── data.js          ← ALL content (profile, career, projects, stack) — edit here
│   ├── App.jsx          ← layout, loader, scroll → scene wiring
│   ├── components/      ← Hero/About/WhatIDo, Career, Work, Stack/Contact, nav
│   ├── three/           ← Scene (lights, keycaps, rig), Workstation (desk, monitor, server), code texture
│   └── styles/global.css
└── .github/workflows/   ← build + deploy to GitHub Pages
```

## Develop
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
npm run preview
```

## Deploy
Push to `master` — GitHub Actions builds the site and publishes it to
https://nghuyne.github.io/portfolio/ (Vite `base` is `/portfolio/`).

---
© 2026 Trần Ngọc Huy · Ho Chi Minh City
