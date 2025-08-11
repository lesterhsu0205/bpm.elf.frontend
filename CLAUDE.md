# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

### Essential Commands
```bash
# Local development
pnpm local              # Start local dev server with SSL certs and web component build
pnpm lint               # Run Next.js ESLint

# Production
pnpm start              # Start production server with SSL certs

# Web Component only
pnpm run build:webcomponent    # Build web component for development
```

### Environment-Specific Builds
All environment builds include webcomponent + next + server steps:
```bash
pnpm run build:dev.local       # Build for local development environment
pnpm run build:dev             # Build for dev environment  
pnpm run build:stg             # Build for staging environment
pnpm run build:uat             # Build for UAT environment
pnpm run build:prod            # Build for production environment
```

## Project Architecture

This is a BPM (Business Process Management) frontend built with Next.js that serves dynamic forms and integrates with external systems through multiple interfaces:

1. **Next.js Web Application** - Main application serving dynamic forms
2. **Web Components** - For embedding into other systems  
3. **Chrome Extension** - Browser extension with specialized navigation

### 🔄 Configuration-Driven Forms Pattern

The system loads JSON configurations from backend APIs to dynamically render forms:

1. **Route**: `pages/[...applyItem].js` receives `applyItem` parameter
2. **Fetch**: Loads JSON config from `${BACKEND_URL}/api/setting/${applyItem}.json`
3. **Render**: `components/content.js` processes config and renders appropriate form elements

### 📁 Key Files & Components

| File | Purpose |
|------|---------|
| `src/pages/[...applyItem].js` | Dynamic page router that loads configurations via getServerSideProps |
| `src/components/content.js` | Core form rendering engine that processes JSON configs |
| `src/webComponent.js` | Modal-based web component for external integration |
| `src/chromeComponent.js` | Chrome extension component with navigation support |
| `src/components/formElements/` | Modular form components (text, select, checkbox, radio, textarea, description) |

### 🔧 Build System

| Configuration | Output | Purpose |
|---------------|--------|---------|
| `webpack.chrome.component.config.js` | `bpm_elf_extension/` | Chrome extension component |
| `webpack.webcomponent.config.js` | `public/js/` | Modal web component |
| `build.js` | `dist/` | Post-build script for deployment packages and TAR archives |

### 🌍 Environment Configuration

Uses dotenv with environment-specific files:
- `.env.dev.local`, `.env.dev`, `.env.stg`, `.env.uat`, `.env.prod`

**Critical Environment Variables:**
- `NEXT_PUBLIC_BACKEND_URL`: API backend for configuration loading
- `NEXT_PUBLIC_WEB_COMPONENT_URL`: Backend URL for web components
- `NEXT_PUBLIC_FED_DIST_GOLD_DIR_PREFIX`: Distribution directory prefix

### 🔗 Integration Methods

**Modal Web Component** (`x-elf-wrapper-modal`):
```html
<x-elf-wrapper-modal 
  applyitem="vm" 
  backendurl="http://localhost:3000/bpm-elf"
  buttontext="Open Form"
  buttonclass="btn btn-primary">
</x-elf-wrapper-modal>
```

**Chrome Extension**: Specialized component with mega menu navigation and multi-page support.

### 🔐 SSL Configuration

- Custom SSL certificates in `certs/` directory
- `patch-https.js` configures Node.js to use certificates for dev/prod environments

### 🚀 Deployment Options

1. **Node.js Standalone**: Next.js standalone output with custom server
2. **Static WAR**: For deployment to Java application servers

The `build.js` script handles packaging for both methods and creates compressed archives.

## Git Workflow
When merging branches, use `git merge --no-ff` to preserve branch history and create clear merge commits.