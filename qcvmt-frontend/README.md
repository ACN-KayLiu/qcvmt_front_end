# QCVMT Frontend

React 18 + TypeScript + Vite 5 frontend scaffold for the QCVMT migration.

## Tech Stack

- React 18
- TypeScript 5
- Vite 5
- Ant Design 5
- Zustand
- React Router 6
- Axios
- keycloak-js
- react-i18next
- React Hook Form + Zod
- Vitest + Testing Library

## Scripts

- `npm run dev` start development server
- `npm run build` type-check and build
- `npm run preview` preview production build
- `npm run lint` run eslint
- `npm run test` run vitest in watch mode
- `npm run test:ci` run tests with coverage

## Environment Variables

Use `.env.development` and `.env.production`:

- `VITE_API_BASE_URL`
- `VITE_KEYCLOAK_URL`
- `VITE_KEYCLOAK_REALM`
- `VITE_KEYCLOAK_CLIENT_ID`
- `VITE_APP_DEFAULT_LOCALE`

## Project Structure

- `src/app` app providers and error boundary
- `src/router` route definitions
- `src/lib` keycloak, axios, i18n setup
- `src/api` backend API wrappers by domain
- `src/stores` zustand stores
- `src/hooks` reusable hooks such as polling and clock
- `src/components` reusable UI blocks
- `src/pages` page-level components
- `src/styles` global/theme/bay styles
- `src/tests` unit tests setup and specs

## Current Delivery Scope

Implemented:

- Core app shell with auth bootstrap
- Keycloak integration skeleton
- API client with timeout, retry and 401/403 handling
- Terminal page base rendering flow
- Admin route tree
- User CRUD module (list/search/paging/create/edit/delete/logs)
- Vessel CRUD module (list/search/paging/create/edit/delete)
- Color Set CRUD module (list/search/paging/create/edit/delete)
- Vessel Color CRUD module (list/search/paging/create/edit/delete)
- Vessel Refuel CRUD module (list/search/paging/create/edit/delete)
- Route-level lazy loading and vendor chunk splitting
- i18n resources (`en`, `zh-CN`, `zh-TW`)
- Dark mode support through CSS variables + antd theme algorithm
- Validation utilities and sample tests

Pending business completion:

- Complete Bay Config, Import/Export pages with real API interactions
- Finalize terminal data transformation details with backend payload
- Expand unit/integration coverage for hooks, pages, and API workflows
- Optional Playwright E2E
