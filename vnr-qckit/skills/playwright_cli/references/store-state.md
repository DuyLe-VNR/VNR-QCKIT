# Storing State

Persist extracted data and intermediate results between steps or across CLI invocations.

## Write extracted data to disk

```bash
# Dump a JS expression result to a file
playwright-cli evaluate "JSON.stringify(window.__extractedRows, null, 2)" \
  > playwright-output/data/rows.json

# Append rather than overwrite (shell)
playwright-cli evaluate "JSON.stringify(window.__newBatch)" \
  >> playwright-output/data/rows-accumulate.json
```

## Read state back in a later step

```bash
cat playwright-output/data/rows.json
```

Or inject it back into the page:

```bash
DATA=$(cat playwright-output/data/config.json)
playwright-cli evaluate "window.__config = $DATA;"
```

## Accumulate paginated data

Collect rows across multiple pages into a single in-memory array, then dump once:

```bash
# Initialise accumulator on page 1
playwright-cli evaluate "window.__rows = window.__rows || [];"

# Collect current page rows
playwright-cli evaluate "
  const batch = Array.from(document.querySelectorAll('tr.data-row'))
    .map(r => r.innerText.trim());
  window.__rows.push(...batch);
  window.__rows.length;   // returns running total
"

# Click next page
playwright-cli click "role=button[name='Next']"
playwright-cli wait_for_selector "css=tr.data-row"

# Repeat evaluate above for each page, then dump:
playwright-cli evaluate "JSON.stringify(window.__rows, null, 2)" \
  > playwright-output/data/all-rows.json
```

## Track visited URLs

```bash
playwright-cli evaluate "window.__visited = window.__visited || [];"
playwright-cli evaluate "window.__visited.push(window.location.href); window.__visited.length;"
playwright-cli evaluate "JSON.stringify(window.__visited)" > playwright-output/data/visited.json
```

## Timestamped output files (avoid overwriting)

Use the shell to stamp filenames:

```bash
DATE=$(date +%Y-%m-%d)
playwright-cli evaluate "JSON.stringify(window.__results)" \
  > "playwright-output/data/results-$DATE.json"
```

## Output folder convention

```
playwright-output/data/
  rows.json            ← latest run
  rows-2026-06-11.json ← timestamped archive
  config.json          ← injected config snapshot
  visited.json         ← URL crawl log
```

## Notes

- `playwright-cli evaluate` returns the serialised value to **stdout** — pipe with `>` to write to file.
- Keep state files small; large accumulations (>10 MB) should be streamed page-by-page to disk instead of buffered in `window.__rows`.
- Add `playwright-output/data/` to `.gitignore` if data is environment-specific or contains PII.
