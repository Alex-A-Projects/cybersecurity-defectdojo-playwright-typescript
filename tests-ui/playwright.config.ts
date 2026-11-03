/**
 * Canonical per-suite config for the UI suite — re-exports the framework's
 * `playwright.ui.config.ts`.
 *
 * Existing so that when this folder (`tests-ui/`) is opened as a workspace
 * root (multi-root workspace mode), the Microsoft Playwright extension can
 * discover a `playwright.config.ts` and surface the UI suite in the Testing
 * panel independently of the root shim.
 */
export { default } from '../playwright.ui.config';
