# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development
```bash
pnpm local              # Start local dev server with SSL certs and web component build
```

### Building
```bash
# Web Component builds
pnpm run build:webcomponent    # Build web component for development

# Environment-specific builds (all include webcomponent + next + server steps)
pnpm run build:dev.local       # Build for local development environment
pnpm run build:dev             # Build for dev environment  
pnpm run build:stg             # Build for staging environment
pnpm run build:uat             # Build for UAT environment
pnpm run build:prod            # Build for production environment

# Production server
pnpm start                     # Start production server with SSL certs
```

### Linting
```bash
pnpm lint              # Run Next.js ESLint
```

## Project Architecture

This is a BPM (Business Process Management) frontend built with Next.js that serves dynamic forms and integrates with external systems through multiple interfaces:

1. **Next.js Web Application** - Main application serving dynamic forms
2. **Web Components** - For embedding into other systems  
3. **Chrome Extension** - Browser extension with specialized navigation

### Core Architecture Pattern

**Configuration-Driven Forms**: The system loads JSON configurations from backend APIs to dynamically render forms. The pattern is:

1. Route: `pages/[...applyItem].js` receives `applyItem` parameter
2. Fetch: Loads JSON config from `${BACKEND_URL}/api/setting/${applyItem}.json`
3. Render: `components/content.js` processes config and renders appropriate form elements

### Key Components

- **`src/pages/[...applyItem].js`**: Dynamic page router that loads configurations via getServerSideProps
- **`src/components/content.js`**: Core form rendering engine that processes JSON configs and renders form elements
- **`src/webComponent.js`**: Modal-based web component for external integration
- **`src/chromeComponent.js`**: Chrome extension component with navigation and multi-page support
- **`src/components/formElements/`**: Modular form components (text, select, checkbox, radio, textarea, description)

### Build System

The project uses multiple webpack configurations:

- **`webpack.chrome.component.config.js`**: Builds Chrome extension component to `bpm_elf_extension/`
- **`webpack.webcomponent.config.js`**: Builds modal web component to `public/js/`
- **`build.js`**: Post-build script that creates deployment packages and TAR archives

### Environment Configuration

Uses dotenv with environment-specific files:
- `.env.dev.local`, `.env.dev`, `.env.stg`, `.env.uat`, `.env.prod`

Critical environment variables:
- `NEXT_PUBLIC_BACKEND_URL`: API backend for configuration loading
- `NEXT_PUBLIC_WEB_COMPONENT_URL`: Backend URL for web components
- `NEXT_PUBLIC_FED_DIST_GOLD_DIR_PREFIX`: Distribution directory prefix

### Integration Methods

**Modal Web Component** (`x-elf-wrapper-modal`):
```html
<x-elf-wrapper-modal 
  applyitem="vm" 
  backendurl="http://localhost:3000/bpm-elf"
  buttontext="Open Form"
  buttonclass="btn btn-primary">
</x-elf-wrapper-modal>
```

**Chrome Extension**: Specialized component with mega menu navigation and multi-page support, deployed to browser extensions.

### SSL Configuration

Uses custom SSL certificates in `certs/` directory. The `patch-https.js` file configures Node.js to use these certificates for development/production environments.

### Deployment

Two deployment modes:
1. **Node.js Standalone**: Uses Next.js standalone output with custom server
2. **Static WAR**: For deployment to Java application servers (commented references to JBoss)

The `build.js` script handles packaging for both deployment methods and creates compressed archives.