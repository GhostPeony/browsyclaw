# browse-and-extract

Navigate to a URL and extract structured data, handling login walls, cookie consent, and CAPTCHAs automatically.

## Usage

```
/browse-and-extract https://example.com/pricing
```

## What it does

Uses browsy's zero-render browser to navigate, detect obstacles, and extract content:

- **Page intelligence** — calls `browsy_page_info` to classify the page and detect login forms, consent dialogs, verification prompts, and pagination
- **Obstacle handling** — automatically dismisses cookie consent banners, authenticates through login walls (prompting user for credentials), and flags CAPTCHAs for manual intervention
- **Structured extraction** — pulls table data via `browsy_tables`, locates specific content with `browsy_find`, and returns clean structured output
- **Hidden content exposure** — browsy's Spatial DOM includes elements hidden behind dropdowns, modals, accordion panels, and tabs without needing JavaScript execution
- **Session continuity** — maintains cookies and form state across multiple page loads within the same session

## Workflow

1. `browsy_browse` — navigate to the target URL
2. `browsy_page_info` — check page type and suggested actions
3. Handle obstacles based on suggested actions:
   - **Consent dialog**: `browsy_find` to locate accept/dismiss button, then `browsy_click`
   - **Login required**: ask user for credentials, then `browsy_login`
   - **Verification code**: ask user for code, then `browsy_enter_code`
   - **CAPTCHA**: inform user that manual intervention is needed
4. `browsy_tables` — extract any structured table data
5. `browsy_find` — locate specific content elements by text or ARIA role
6. Return extracted data in clean, structured format

## Example output

```
Navigating to https://example.com/pricing...

Page detected: Content page
No obstacles detected.

=== Extracted Tables (1) ===

| Plan    | Price   | Features              |
|---------|---------|----------------------|
| Free    | $0/mo   | 5 projects, 1GB      |
| Pro     | $29/mo  | Unlimited, 100GB     |
| Team    | $99/mo  | SSO, audit log, API  |

=== Key Elements ===

[12:a "Start free trial" @mid]
[15:a "Compare plans" @mid]
[18:a "Contact sales" @bot]
```

## Example with login wall

```
Navigating to https://dashboard.example.com/reports...

Page detected: Login
Suggested actions: Login

Login form detected. Please provide credentials.
> Username: user@example.com
> Password: ********

Authenticating... success.
Redirected to: https://dashboard.example.com/reports

=== Report Data ===

| Metric     | This Week | Last Week | Change |
|------------|-----------|-----------|--------|
| Users      | 1,245     | 1,102     | +13%   |
| Revenue    | $8,430    | $7,210    | +17%   |
```

## Requirements

- `@openclaw/browsy` plugin must be registered
- browsy server must be running (auto-started if `autoStart: true`)
