/**
 * Canonical per-suite config for the API suite — re-exports the framework's
 * `playwright.api.config.ts`.
 *
 * Drop this folder as a workspace root in a multi-root workspace and the
 * Playwright extension surfaces API tests in the Testing panel independently
 * of the root shim.
 */
export { default } from '../playwright.api.config';
