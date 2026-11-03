/**
 * Canonical per-suite config for the DB suite — re-exports the framework's
 * `playwright.db.config.ts`.
 *
 * Drop this folder as a workspace root in a multi-root workspace and the
 * Playwright extension surfaces DB tests in the Testing panel independently
 * of the root shim.
 */
export { default } from '../playwright.db.config';
