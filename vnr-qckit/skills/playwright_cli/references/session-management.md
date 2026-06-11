# Session Management

Persist authentication state (cookies, localStorage, sessionStorage) across runs to avoid logging in repeatedly.

## Save session after login

Run this once per role. After a successful login, save the full browser storage state:

```bash
playwright-cli navigate "https://app.example.com/login"
playwright-cli fill "css=#email"    "admin@example.com"
playwright-cli fill "css=#password" "s3cret"
playwright-cli click "role=button[name='Sign in']"
playwright-cli wait_for_selector "css=.dashboard"

# Save state — captures cookies + localStorage + sessionStorage
playwright-cli save_storage_state "playwright-output/sessions/admin.json"
```

## Reuse saved session (skip login)

On subsequent runs, load state **before** navigating to any authenticated page:

```bash
playwright-cli load_storage_state "playwright-output/sessions/admin.json"
playwright-cli navigate "https://app.example.com/dashboard"
```

## Multiple roles

Save one file per role:

```bash
playwright-output/sessions/
  admin.json
  editor.json
  viewer.json
  guest.json
```

## Validate session is still live

```bash
playwright-cli evaluate "document.cookie.includes('session_id')"
playwright-cli evaluate "!!localStorage.getItem('auth_token')"
```

If the result is `false`, re-run the login flow and overwrite the state file.

## Manually inject a cookie

Useful when the backend issues tokens directly (CI/CD, API-key auth):

```bash
playwright-cli add_cookies '[
  {
    "name":   "auth_token",
    "value":  "eyJhbGc...",
    "domain": "app.example.com",
    "path":   "/",
    "httpOnly": true,
    "secure": true
  }
]'
```

## Clear all auth state

Reset to a logged-out baseline between test suites:

```bash
playwright-cli clear_cookies
playwright-cli evaluate "localStorage.clear(); sessionStorage.clear();"
```

## Login flow — canonical pattern

```
1. load_storage_state <role>.json         (if file exists)
2. navigate to a protected URL
3. if redirected to /login → session expired:
     a. fill credentials
     b. submit
     c. wait for dashboard
     d. save_storage_state → overwrite file
4. proceed with test
```

## Notes

- State files contain sensitive credentials — add `playwright-output/sessions/` to `.gitignore`.
- Session expiry is environment-specific; re-save after major auth changes (token rotation, password reset).
- `load_storage_state` must be called **before** the first `navigate` to ensure cookies are sent on the initial request.
