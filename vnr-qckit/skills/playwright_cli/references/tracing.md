# Tracing

Capture full execution traces — network, console, DOM snapshots, screenshots — for debugging failures.

## Basic trace

```bash
# 1. Start trace BEFORE actions
playwright-cli tracing_start --screenshots --snapshots --sources

# 2. Run actions / test steps…

# 3. Stop and save as a .zip archive
playwright-cli tracing_stop "playwright-output/traces/login-flow.zip"
```

## View a trace

Open the Playwright Trace Viewer in a browser:

```bash
playwright-cli show_trace "playwright-output/traces/login-flow.zip"
```

The viewer shows:
- Timeline of every action
- Before/after DOM snapshot for each step
- Network waterfall (requests, responses, timing)
- Console log entries
- Source file at the line that triggered each action

## Trace options

| Flag | What it captures |
|---|---|
| `--screenshots` | Screenshot at each action (required for timeline thumbnails) |
| `--snapshots` | Full DOM snapshot before and after each action |
| `--sources` | Source file content linked to each action |

Minimal trace (smallest file):

```bash
playwright-cli tracing_start
# no flags — records actions and network only
```

Full debug trace:

```bash
playwright-cli tracing_start --screenshots --snapshots --sources
```

## Chunk tracing (multi-step tests)

Split a long test into named chunks, each with its own archive:

```bash
playwright-cli tracing_start --screenshots --snapshots

# — login chunk —
playwright-cli tracing_start_chunk "login"
playwright-cli navigate "https://app.example.com/login"
playwright-cli fill "css=#email" "user@example.com"
playwright-cli click "role=button[name='Sign in']"
playwright-cli tracing_stop_chunk "playwright-output/traces/chunk-login.zip"

# — checkout chunk —
playwright-cli tracing_start_chunk "checkout"
playwright-cli navigate "https://app.example.com/cart"
playwright-cli click "role=button[name='Checkout']"
playwright-cli tracing_stop_chunk "playwright-output/traces/chunk-checkout.zip"

playwright-cli tracing_stop "playwright-output/traces/full-run.zip"
```

## Always trace on failure

When an assertion fails:

```bash
playwright-cli tracing_stop "playwright-output/traces/failure-$(date +%Y%m%d-%H%M%S).zip"
playwright-cli show_trace  "playwright-output/traces/failure-$(date +%Y%m%d-%H%M%S).zip"
```

Or configure this as the default failure handler so every failed run auto-saves a trace.

## Output folder

```
playwright-output/traces/
  login-flow.zip
  chunk-login.zip
  chunk-checkout.zip
  failure-20260611-143022.zip
```

## Trace file contents

A `.zip` contains:

```
trace.trace       ← event stream (actions, network, console)
trace.network     ← full network HAR
resources/        ← DOM snapshots, screenshots, source files
```

## Notes

- Traces can be large (10–50 MB for complex flows) — don't commit them; add `playwright-output/traces/` to `.gitignore`.
- `tracing_start_chunk` / `tracing_stop_chunk` require an outer `tracing_start` to be active first.
- The Trace Viewer URL (`playwright-cli show_trace`) opens at `http://localhost:9323` by default.
