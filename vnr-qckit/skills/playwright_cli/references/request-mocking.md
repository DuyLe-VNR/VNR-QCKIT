# Request Mocking

Intercept and stub network calls to isolate front-end behaviour from real APIs.

## Basic route stub

```bash
# Mock a GET endpoint with static JSON
playwright-cli route "https://api.example.com/users" \
  --method GET \
  --body '{"users":[{"id":1,"name":"Alice"}]}' \
  --status 200 \
  --content-type "application/json"
```

## Block requests (speed up tests)

```bash
# Abort all image/font requests
playwright-cli route "**/*.{png,jpg,gif,svg,woff2}" --abort

# Abort analytics calls
playwright-cli route "**/analytics/**" --abort
playwright-cli route "**/gtag/**" --abort
```

## Simulate error responses

```bash
# 500 server error
playwright-cli route "https://api.example.com/pay" \
  --status 500 \
  --body '{"error":"Payment gateway unavailable"}'

# 401 unauthorized
playwright-cli route "https://api.example.com/profile" \
  --status 401 \
  --body '{"message":"Token expired"}'

# 404 not found
playwright-cli route "https://api.example.com/items/999" \
  --status 404 \
  --body '{"message":"Item not found"}'
```

## Simulate network latency

```bash
# Slow endpoint (3 second delay)
playwright-cli route "https://api.example.com/report" \
  --delay 3000 \
  --body '{"status":"ok"}'
```

## Mock patterns (wildcards)

```bash
# Stub all calls to a base URL path
playwright-cli route "https://api.example.com/products/**" \
  --body '[]' --status 200

# Stub by query param presence
playwright-cli route "**/search?**" \
  --body '{"results":[],"total":0}' --status 200
```

## Remove mocks

```bash
# Remove a specific route
playwright-cli unroute "https://api.example.com/users"

# Clear ALL active routes
playwright-cli unroute_all
```

## Rules

- Always call `playwright-cli route` **before** `playwright-cli navigate` — routes registered after page load may miss in-flight requests.
- Remove mocks after each test block to prevent bleed-through between test cases.
- Use `--abort` for third-party trackers and CDN assets to keep tests fast and deterministic.
