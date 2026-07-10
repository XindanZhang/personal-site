# Xindan Zhang — Personal Site

Personal website built with TanStack Start and React, prerendered for GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

## Build for GitHub Pages

This project prerenders every route and copies the static client output to `docs/` for GitHub Pages on the `main` branch.

```sh
npm run build
```

Then commit and push. In GitHub Pages settings, select **Deploy from a branch** → `main` → `/docs`.
