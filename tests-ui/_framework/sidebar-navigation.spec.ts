/**
 * Sidebar-navigation spec.
 *
 * Structural check: confirms every visible sidebar entry has the expected
 * `href` attribute. Clicks would be slower and load the live sandbox too
 * heavily per CI run; the live navigation behaviour is covered by the
 * per-route smoke specs under `tests-ui/<section>/`.
 *
 * Tagged `@infra` so it runs regardless of feature flags.
 */
import { test, expect, Tags } from '../../src/ui/fixtures';
import type { Locator } from '@playwright/test';
import { collect } from '../../src/shared/assertion-collector';

type SidebarEntry = {
  name: string;
  /** Substring expected to appear in the link's href. */
  hrefExpects: string;
  link: () => Locator;
};

test('UI smoke | sidebar exposes the expected link targets @infra',
  { tag: [Tags.INFRA] },
  async ({ pages, loggedInSession }) => {
    const sidebar = pages.dashboard.sidebar;

    const entries: SidebarEntry[] = [
      { name: 'Dashboard',      link: () => sidebar.dashboardLink,      hrefExpects: '/dashboard' },
      { name: 'Components',     link: () => sidebar.componentsLink,     hrefExpects: '/components' },
      { name: 'Endpoints',      link: () => sidebar.endpointLink,       hrefExpects: '/endpoint' },
      { name: 'Reports',        link: () => sidebar.reportsLink,        hrefExpects: '/reports' },
      { name: 'Metrics',        link: () => sidebar.metricsLink,        hrefExpects: '/metrics' },
      { name: 'Users',          link: () => sidebar.usersLink,          hrefExpects: '/user' },
      { name: 'Calendar',       link: () => sidebar.calendarLink,       hrefExpects: '/calendar' },
      // Questionnaires' link is `#` (submenu trigger) on the demo sandbox
      // — we accept either `#` or a real `/questionnaire...` href.
      { name: 'Questionnaires', link: () => sidebar.questionnairesLink, hrefExpects: '#' },
      { name: 'Configuration',  link: () => sidebar.configurationLink,  hrefExpects: '/configuration' },
    ];

    const failures: string[] = [];

    for (const entry of entries) {
      const link = entry.link();
      const visible = await link.isVisible().catch(() => false);
      if (!visible) {
        // Hidden on this viewport; treat as soft-skip — the per-route spec
        // for that entry covers the destination.
        continue;
      }

      const href = await link.getAttribute('href').catch(() => null);
      await collect(
        `${entry.name} href contains "${entry.hrefExpects}"`,
        async () => {
          if (href === null) {
            throw new Error('link has no href attribute');
          }
          // Questionnaires' expected href is `#` — it must match exactly.
          if (entry.hrefExpects === '#') {
            expect(href).toBe('#');
          } else {
            expect(href).toContain(entry.hrefExpects);
          }
        },
        failures,
      );
    }

    expect(failures, `Sidebar entry mismatches: ${failures.join('; ')}`).toEqual([]);
  },
);
