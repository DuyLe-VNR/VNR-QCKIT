# Running Code in the Browser

Execute arbitrary JavaScript inside the live page context using `playwright-cli evaluate`.

## Simple expressions

```bash
# Get current URL
playwright-cli evaluate "window.location.href"

# Read a DOM value
playwright-cli evaluate "document.querySelector('h1').innerText"

# Check a flag set by the app
playwright-cli evaluate "window.__featureFlags.darkMode"
```

## Multi-line scripts (IIFE pattern)

Wrap complex logic in a self-invoking function so it returns a single value:

```bash
playwright-cli evaluate "
  (() => {
    const rows = document.querySelectorAll('table tbody tr');
    return Array.from(rows).map(row => ({
      id:    row.dataset.id,
      name:  row.cells[0].innerText.trim(),
      value: row.cells[1].innerText.trim()
    }));
  })()
"
```

## Inject helper scripts

Add utilities the page doesn't already have:

```bash
# Inject a global helper
playwright-cli add_script_tag \
  --content "window.__testHelpers = { formatDate: d => new Date(d).toISOString() };"

# Inject from an external URL (CDN library)
playwright-cli add_script_tag --url "https://cdn.example.com/lib.min.js"
```

## Wait for custom conditions

Poll until app state meets your condition (avoids arbitrary `sleep`):

```bash
# Wait until a SPA finishes bootstrapping
playwright-cli wait_for_function "window.__appReady === true" --timeout 10000

# Wait until a specific element count appears
playwright-cli wait_for_function \
  "document.querySelectorAll('.product-card').length >= 5" \
  --timeout 8000
```

## Dispatch custom events

Trigger app event handlers directly without UI interaction:

```bash
playwright-cli evaluate \
  "document.dispatchEvent(new CustomEvent('app:reload', { detail: { force: true } }))"

playwright-cli evaluate \
  "window.dispatchEvent(new StorageEvent('storage', { key: 'auth', newValue: null }))"
```

## Modify DOM or app state directly

```bash
# Force a specific state
playwright-cli evaluate "window.__store.dispatch({ type: 'SET_LOCALE', payload: 'vi' })"

# Bypass client-side validation for speed testing
playwright-cli evaluate "document.querySelector('form').noValidate = true;"
```

## Notes

- `evaluate` runs in the **page context** — no access to Node.js APIs.
- Return values must be JSON-serialisable (no DOM nodes, no functions).
- If the expression throws, `playwright-cli evaluate` exits with a non-zero code — check stderr.
