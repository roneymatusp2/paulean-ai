# St. Paul's School Website Development Guidelines

## Project Commands
After setting up the project, use these commands:

```bash
# Development Server
npm run dev

# Build for Production
npm run build

# Preview Production Build
npm run preview

# Lint Project
npm run lint
```

## Branding Guidelines

### Logo Usage
- When working with St. Paul's logos, use the components we've created specifically for this purpose:
  - `StPaulsLogo.tsx`: For general logo usage across the site
  - `AccreditationLogos.tsx`: For displaying accreditation logos

### URL Encoding
- When referencing logo assets, **always use URL-encoded paths** (`%20` for spaces)
- Example: `/logos/BRAND_ST%20PAULS_Solid%20Colour_N.png`

### Color System
The Tailwind configuration includes the official St. Paul's color scheme:
- Primary colors: blue (#002f5c), red (#a3282f), etc.
- Secondary colors: coral (#f17e6f), teal (#117A8D), etc.

## Post-Build Checks
Before deployment, always verify:
1. Logos display correctly
2. Favicon appears in browser tab
3. Meta tags are properly set for social sharing

## Technical Notes
- Use type-only imports in TypeScript files: `import type { ReactNode } from 'react'`
- Ensure proper closing tags in JSX components
- Follow the ESM pattern for module imports/exports

This file serves as a reference for working on the St. Paul's website project.