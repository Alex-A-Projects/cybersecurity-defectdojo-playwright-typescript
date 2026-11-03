import type { Locator, Page } from '@playwright/test';

/**
 * A single labelled form field used heavily in DefectDojo's many `<form>`
 * pages (product create, finding create, etc.). Wraps the label + control +
 * any help text + any field-level error.
 */
export class FormFieldComponent {
  readonly root: Locator;
  readonly label: Locator;
  readonly input: Locator;
  readonly helpText: Locator;
  readonly errorText: Locator;

  constructor(private readonly page: Page, labelText: string | RegExp) {
    this.root = page.locator('.form-group, .form-row, .mb-3').filter({ hasText: labelText }).first();
    this.label = page.getByLabel(labelText).first();
    this.input = page.getByLabel(labelText).first();
    this.helpText = page.locator('.help-block, .form-text').first();
    this.errorText = page.locator('.invalid-feedback, .errorlist li, .text-danger').first();
  }

  async fill(value: string): Promise<void> {
    await this.input.fill(value);
  }

  async selectByLabel(option: string): Promise<void> {
    // For selects; a simpler `selectOption({ label })` would do.
    await this.input.selectOption({ label: option });
  }
}
