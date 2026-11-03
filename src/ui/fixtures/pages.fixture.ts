import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { ProductListPage } from '../pages/product-list.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { EngagementListPage } from '../pages/engagement-list.page';
import { EngagementDetailPage } from '../pages/engagement-detail.page';
import { FindingListPage } from '../pages/finding-list.page';
import { FindingDetailPage } from '../pages/finding-detail.page';
import { ComponentsPage } from '../pages/components.page';
import { EndpointPage } from '../pages/endpoint.page';
import { MetricsPage } from '../pages/metrics.page';
import { CalendarPage } from '../pages/calendar.page';
import { QuestionnairesPage } from '../pages/questionnaires.page';
import { ConfigurationPage } from '../pages/configuration.page';
import { UserListPage } from '../pages/user-list.page';
import { ReportPage } from '../pages/report.page';
import { NotFoundPage } from '../pages/not-found.page';

/*
 * Page fixture layer — pure POM instantiation.
 *
 * This layer only constructs Page Objects against the current `page`. It
 * performs no navigation, no "ready state" preparation, no workflow
 * orchestration — those belong in the flows layer (flows.fixture.ts).
 *
 * Dependency direction: core → pages → flows.
 */

export type AppPages = {
  login: LoginPage;
  dashboard: DashboardPage;
  productList: ProductListPage;
  productDetail: ProductDetailPage;
  engagementList: EngagementListPage;
  engagementDetail: EngagementDetailPage;
  findingList: FindingListPage;
  findingDetail: FindingDetailPage;
  components: ComponentsPage;
  endpoint: EndpointPage;
  metrics: MetricsPage;
  calendar: CalendarPage;
  questionnaires: QuestionnairesPage;
  configuration: ConfigurationPage;
  userList: UserListPage;
  report: ReportPage;
  notFound: NotFoundPage;
};

export type PagesFixtures = {
  pages: AppPages;
};

export const pagesFixture: Parameters<typeof base.extend<PagesFixtures>>[0] = {
  pages: async (
    { page }: { page: Page },
    use: (value: AppPages) => Promise<void>,
  ) => {
    await use({
      login: new LoginPage(page),
      dashboard: new DashboardPage(page),
      productList: new ProductListPage(page),
      productDetail: new ProductDetailPage(page),
      engagementList: new EngagementListPage(page),
      engagementDetail: new EngagementDetailPage(page),
      findingList: new FindingListPage(page),
      findingDetail: new FindingDetailPage(page),
      components: new ComponentsPage(page),
      endpoint: new EndpointPage(page),
      metrics: new MetricsPage(page),
      calendar: new CalendarPage(page),
      questionnaires: new QuestionnairesPage(page),
      configuration: new ConfigurationPage(page),
      userList: new UserListPage(page),
      report: new ReportPage(page),
      notFound: new NotFoundPage(page),
    });
  },
};
