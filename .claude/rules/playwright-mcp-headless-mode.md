# Playwright MCP Browser Mode — Headless-First

When using Playwright MCP for DefectDojo test automation, **always run in headless mode by default**.

## Rule

Do not enable headed mode (`--headed`, `headless: false`) unless there is a justified, documented need.

## Prohibited uses of headed mode

- Application exploration
- Locator discovery
- Page Object creation
- DOM / accessibility inspection
- Network analysis
- Routine debugging

Use MCP inspection tools in headless mode instead.

## When headless mode is standard

Default for all test automation and debugging:

- DOM inspection → `mcp__playwright__browser_snapshot`
- Accessibility tree → snapshot accessibility tree
- Screenshots → `mcp__playwright__browser_take_screenshot`
- Console debugging → `mcp__playwright__browser_console_messages`
- Network analysis → `mcp__playwright__browser_network_requests`

## When headed mode may be justified

- Bug reproduction after headless investigation
- Animation / rendering issues
- Browser-specific behaviour
- Explicit user request

## Approval criteria before headed mode

1. Inspect browser snapshots
2. Review screenshots
3. Check console messages
4. Analyse network requests
5. Explain why headless investigation is insufficient

## Rationale

- CI/CD efficiency
- Reproducibility
- Resource usage

**Summary:** Headless is the standard for DefectDojo automation. Use MCP tools first.
