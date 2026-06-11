# Test Generation

Record interactive sessions and emit reusable Playwright TypeScript spec files.

## Record a session

```bash
# 1. Start recording — every click, fill, navigation is captured
playwright-cli record_start

# 2. Perform the user journey manually (navigate, fill, click, assert…)

# 3. Stop and emit a .spec.ts file
playwright-cli record_stop "playwright-output/tests/login.spec.ts"
```

## Generated file template

```typescript
import { test, expect } from '@playwright/test';

test('descriptive test name', async ({ page }) => {
  await page.goto('https://app.example.com/login');
  await page.fill('#email',    'user@example.com');
  await page.fill('#password', 'secret');
  await page.click('button[type="submit"]');
  await expect(page.locator('.dashboard-header')).toBeVisible();
});
```

## Run a generated test

```bash
playwright-cli run_test "playwright-output/tests/login.spec.ts"
```

Run only tests matching a pattern:

```bash
playwright-cli run_test "playwright-output/tests/login.spec.ts" --grep "TC-01"
```

Run in headed mode (visible browser):

```bash
playwright-cli run_test "playwright-output/tests/login.spec.ts" --headed
```

## Assertions — reference

Add these after generation to lock expected behaviour:

```bash
# Element is visible
playwright-cli assert_visible "css=.dashboard-header"

# Element has specific text
playwright-cli assert_text "css=#welcome-msg" "Welcome, Alice"

# Current URL matches
playwright-cli assert_url "https://app.example.com/dashboard"

# Exact element count
playwright-cli assert_count "css=.notification-item" 3

# Element is hidden / not present
playwright-cli assert_hidden "css=.error-banner"

# Input has value
playwright-cli assert_value "css=#search-input" "keyword"
```

## Test file naming convention

```
playwright-output/tests/
  {screen}-{flow}.spec.ts

Examples:
  login-success.spec.ts
  checkout-payment-error.spec.ts
  dashboard-filter-by-date.spec.ts
```

## Multiple test cases in one file

Structure with `test.describe` for logical grouping:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login screen', () => {
  test('TC-01 — success with valid credentials', async ({ page }) => { /* … */ });
  test('TC-02 — error with wrong password',       async ({ page }) => { /* … */ });
  test('TC-03 — redirect after login',            async ({ page }) => { /* … */ });
});
```

## Notes

- After recording, review generated selectors — recorder may pick fragile `nth-child` selectors; replace with `role=` or `data-testid=` locators where possible.
- Parameterise credentials via environment variables or a `datafake.json` — never hard-code secrets in spec files.
- Generated specs integrate with `qc_auto_test` — place them in `.specify/specs/{PBI_ID}/` and follow the testcase.md TC-ID naming convention.
