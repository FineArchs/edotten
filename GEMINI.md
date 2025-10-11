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
  Starts the application on `http://localhost:3000` with hot-reloading.
  ```bash
  pnpm dev
  ```

- **Create Production Build:**
  Builds the optimized and minified application for deployment.
  ```bash
  pnpm build
  ```

- **Run Linter & Auto-Fix:**
  Checks for code quality issues and automatically applies safe fixes.
  ```bash
  pnpm lint
  ```

- **Format Code:**
  Formats all source files according to the rules in `biome.json`.
  ```bash
  pnpm format
  ```

## 3. Development Conventions

- **Code Style:** Code formatting and linting are strictly managed by **Biome.js**. The configuration is in `biome.json`, which specifies 2-space indentation and recommended rules for React.
- **Component Structure:** Reusable React components are located in the `src/components/` directory. Main pages/views are located within the `src/app/` directory.
- **Styling:** All styling is done using **Tailwind CSS**. Utility classes should be used directly in the JSX. Global styles are minimal and defined in `src/app/globals.css`.
- **State Management:** Application state is managed locally within components using standard React Hooks (`useState`, `useRef`, `useEffect`, `useContext`). There is no external state management library like Redux.
- **Typing:** The project is written in **TypeScript** with `strict: true` mode enabled in `tsconfig.json`. All new code should be strongly typed.
- **Path Aliases:** The alias `@/*` is configured to point to the `src/*` directory for cleaner import paths. For example: `import Canvas from '@/components/Canvas';`.
