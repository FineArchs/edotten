# GEMINI.md: Project Edotten

This file provides a comprehensive overview of the Edotten project, its structure, and development conventions to be used as instructional context for future interactions.

## 1. Project Overview

**Edotten** is a browser-based dot-picture (pixel art) editor. The goal is to create a client-side application that allows users to draw pixel art, manage colors, use guide images, and export their work as PNGs or animated GIFs.

- **Project Name:** Edotten (仮称)
- **Purpose:** A feature-rich pixel art editor that runs entirely in the browser.
- **Core Technologies:**
  - **Framework:** Next.js (v15) with App Router
  - **Language:** TypeScript
  - **UI:** React (v19)
  - **Styling:** Tailwind CSS (v4)
  - **Drawing:** HTML5 Canvas API
- **Development Tools:**
  - **Package Manager:** pnpm
  - **Linter/Formatter:** Biome.js
- **Architecture:** This is a pure client-side rendering (CSR) application. All logic, rendering, and data storage (initially via `localStorage`) happens in the user's browser, requiring no server backend.

## 2. Building and Running

The project's key scripts are defined in `package.json`.

- **Install Dependencies:**
  ```bash
  pnpm install
  ```

- **Run Development Server:**
  Compiles locales and starts the app on `http://localhost:3000` with hot-reloading.
  ```bash
  pnpm dev
  ```

- **Create Production Build:**
  Compiles locales and builds the optimized application for deployment.
  ```bash
  pnpm build
  ```

- **Run Linter/Formatter**
  Checks for code quality issues and automatically applies safe fixes.
  ```bash
  pnpm lint
  # autofix
  pnpm lint --write
  # autofix(unsafe)
  pnpm lint --write --unsafe
  ```

- **Compile Locales Manually:**
  Manually triggers the script to convert YAML locale files to JSON and generate TypeScript types. This is automatically run by `dev` and `build` scripts.
  ```bash
  pnpm compile:locales
  ```

## 3. Development Conventions

- **Code Style:** Code formatting and linting are strictly managed by **Biome.js**. The configuration is in `biome.json`, which specifies 2-space indentation and recommended rules for React.
- **Component Structure:** Reusable React components are located in the `src/components/` directory. Main pages/views are located within the `src/app/` directory.
- **Styling:** All styling is done using **Tailwind CSS**. Utility classes should be used directly in the JSX. Global styles are minimal and defined in `src/app/globals.css`.
- **Typing:** The project is written in **TypeScript** with `strict: true` mode enabled in `tsconfig.json`. All new code should be strongly typed.
- **Path Aliases:** The alias `@/*` is configured to point to the `src/*` directory for cleaner import paths. For example: `import Canvas from '@/components/Canvas';`.

## 4. Key Features & Implementation Details

### Internationalization (i18n)

The project uses a custom, type-safe i18n pipeline.

1.  **Source:** Language strings are defined in YAML files in `locales/` (e.g., `en.yaml`, `ja.yaml`).
2.  **Compilation:** The `scripts/compile-locales.mjs` script (run via `pnpm compile:locales`) performs two actions:
    - It converts each YAML file into a JSON file (`public/locales/*.json`) that can be fetched by the client.
    - It uses `en.yaml` as the source of truth to generate a TypeScript interface (`src/types/translations-def.autogen.d.ts`), ensuring all translation keys are strongly typed.
3.  **Usage:** The `LanguageProvider` in `src/context/LanguageContext.tsx` fetches the appropriate JSON file and provides a `useLanguage` hook. This hook exposes a `t` function for translating keys into the current locale's strings.

### State Management

Application state is managed through a combination of local component state and shared context.

- **UI State:** Temporary or local UI state (e.g., whether a modal is open, the currently selected color) is managed within components using `useState`.
- **Settings Context:** App-wide settings (canvas size, grid color, keyboard shortcuts) are managed via `SettingsContext`. This context also handles persisting these settings to `localStorage`, so they are remembered across sessions.
- **Language Context:** The current locale and the `t` function for translations are provided by the `LanguageContext`.

## Users Comments

- DO NOT hardcode texts shown as much as possible. Use locales/**.json and src/context/LanguageContext.tsx ;
- replace tool is buggy with editor, use write_file tool instead.
