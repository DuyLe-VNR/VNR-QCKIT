---
description: >
  Automates browser interactions for web testing, form filling, screenshots, and data extraction.
  Use when the user needs to navigate a website, interact with web pages, fill forms, take
  screenshots, test a web application, or extract information from web pages.
allowed-tools:
  - Bash(playwright-cli:*)
user-invocable: false
---

# /playwright-cli

Drive a real browser via the `playwright-cli` MCP tool to navigate, interact, capture, and extract.

---

## User Input

```text
$ARGUMENTS
```

Parse `$ARGUMENTS` to determine intent:

| Keyword / pattern | Mode |
|---|---|
| `screenshot`, `capture`, `snap` | Screenshot mode |
| `fill`, `form`, `submit` | Form-fill mode |
| `extract`, `scrape`, `get data`, `list` | Data-extraction mode |
| `test`, `verify`, `check`, `assert` | Test mode |
| `navigate`, `open`, `go to` | Navigation mode |
| Anything else | Interactive / ad-hoc |

If intent is ambiguous, ask one clarifying question before proceeding.

---

## CORE WORKFLOW

### Step 1 — Launch & navigate

```bash
playwright-cli navigate "<URL>"
```

- Use the URL from `$ARGUMENTS` or ask if missing.
- Wait for `networkidle` before proceeding.
- If login is required → see `references/session-management.md`.

### Step 2 — Snapshot context

```bash
playwright-cli snapshot
```

Parse the accessibility tree to understand current page structure before acting.

### Step 3 — Execute mode-specific actions (sections below)

### Step 4 — Report

Summarise: URLs visited · actions performed · data extracted or test results · screenshot paths · errors.

---

## NAVIGATION

```bash
playwright-cli navigate "https://example.com"
playwright-cli click "role=link[name='Settings']"
playwright-cli wait_for_selector "css=.dashboard-header"
playwright-cli go_back
playwright-cli go_forward
playwright-cli reload
```

---

## FORM FILLING

Use `snapshot` first to discover field selectors, then fill top-to-bottom:

```bash
playwright-cli fill   "css=#username"        "john@example.com"
playwright-cli fill   "css=#password"        "s3cret"
playwright-cli check  "css=#agree-terms"
playwright-cli select_option "css=#country"  "Vietnam"
playwright-cli set_input_files "css=input[type=file]" "/path/to/file.pdf"
playwright-cli click  "role=button[name='Submit']"
playwright-cli wait_for_selector "css=.success-message"
```

After submit, take a screenshot to confirm success or capture validation errors.

---

## SCREENSHOTS

```bash
playwright-cli screenshot --full-page             "playwright-output/screenshots/full.png"
playwright-cli screenshot                          "playwright-output/screenshots/viewport.png"
playwright-cli screenshot --selector "css=.chart" "playwright-output/screenshots/chart.png"
playwright-cli set_viewport 1440 900
playwright-cli screenshot                          "playwright-output/screenshots/desktop.png"
```

Name files descriptively: `{screen}-{action}-{YYYY-MM-DD}.png`.

---

## DATA EXTRACTION

```bash
# Single value
playwright-cli evaluate "document.querySelector('h1').innerText"

# Table → JSON array
playwright-cli evaluate "
  Array.from(document.querySelectorAll('table tbody tr')).map(row =>
    Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim())
  )
"

# All links
playwright-cli evaluate "
  Array.from(document.querySelectorAll('a[href]')).map(a =>
    ({ text: a.innerText.trim(), href: a.href })
  )
"

playwright-cli get_attribute "css=meta[name='description']" "content"
```

For advanced JS execution patterns → `references/running-code.md`.
For persisting extracted data across steps → `references/store-state.md`.

---

## REQUEST MOCKING

Stub, block, or delay network calls to isolate front-end behaviour from real APIs.
Full reference → `references/request-mocking.md`.

```bash
# Quick stub
playwright-cli route "https://api.example.com/users" \
  --method GET --status 200 \
  --body '{"users":[{"id":1,"name":"Alice"}]}' \
  --content-type "application/json"

# Block noise (images, analytics)
playwright-cli route "**/*.{png,jpg,svg}" --abort

# Tear down
playwright-cli unroute_all
```

---

## RUNNING CODE

Execute JavaScript inside the live page context.
Full reference → `references/running-code.md`.

```bash
playwright-cli evaluate "window.location.href"
playwright-cli add_script_tag --content "window.__flag = true;"
playwright-cli wait_for_function "window.__appReady === true" --timeout 10000
```

---

## SESSION MANAGEMENT

Persist cookies and storage to avoid repeated logins.
Full reference → `references/session-management.md`.

```bash
# Save after login
playwright-cli save_storage_state "playwright-output/sessions/admin.json"

# Load before navigating (skip login)
playwright-cli load_storage_state "playwright-output/sessions/admin.json"

# Reset
playwright-cli clear_cookies
playwright-cli evaluate "localStorage.clear(); sessionStorage.clear();"
```

---

## STORING STATE

Persist extracted data and intermediate results between steps.
Full reference → `references/store-state.md`.

```bash
playwright-cli evaluate "JSON.stringify(window.__rows)" \
  > playwright-output/data/rows.json

# Accumulate across paginated pages
playwright-cli evaluate "window.__rows = window.__rows || [];"
playwright-cli evaluate "
  window.__rows.push(
    ...Array.from(document.querySelectorAll('tr.data')).map(r => r.innerText)
  );
  window.__rows.length;
"
```

---

## TEST GENERATION

Record sessions and emit reusable TypeScript Playwright spec files.
Full reference → `references/test-generation.md`.

```bash
playwright-cli record_start
# … perform user journey …
playwright-cli record_stop "playwright-output/tests/login.spec.ts"

playwright-cli run_test "playwright-output/tests/login.spec.ts"

# Assertions
playwright-cli assert_visible "css=.dashboard-header"
playwright-cli assert_text    "css=#welcome-msg" "Welcome, Alice"
playwright-cli assert_url     "https://example.com/dashboard"
playwright-cli assert_count   "css=.notification-item" 3
```

---

## TRACING

Capture network, console, DOM snapshots, and screenshots for debugging.
Full reference → `references/tracing.md`.

```bash
playwright-cli tracing_start --screenshots --snapshots --sources
# … run actions …
playwright-cli tracing_stop "playwright-output/traces/flow.zip"

playwright-cli show_trace   "playwright-output/traces/flow.zip"
```

Always capture a trace when **Test mode** encounters an assertion failure.

---

## ERROR HANDLING

| Symptom | Recovery |
|---|---|
| Element not found | `snapshot` → re-check selector; try `role=` or `text=` locators |
| Navigation timeout | `playwright-cli set_default_timeout 30000` |
| Login expired | `clear_cookies` → re-login → `save_storage_state` |
| Mock not applied | Ensure `route` is called **before** `navigate` |
| Flaky assertion | Add `wait_for_selector` before the assertion |

---

## OUTPUT FOLDER CONVENTION

```
playwright-output/
  screenshots/   ← captured images
  traces/        ← .zip trace archives
  sessions/      ← saved auth state (*.json)
  data/          ← extracted JSON / CSV
  tests/         ← generated spec files (*.spec.ts)
```

```bash
mkdir -p playwright-output/{screenshots,traces,sessions,data,tests}
```

---

## NOT FOR

- Running `npm test` / CI pipelines — use the project test runner directly.
- Large-scale headless scraping — use a dedicated crawler.
- PDF generation — use `page.pdf()` via the Playwright Node SDK.
