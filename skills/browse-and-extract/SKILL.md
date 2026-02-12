---
name: browse-and-extract
description: Navigate to a URL and extract structured data, handling login walls and cookie consent automatically
---

# Browse and Extract

Navigate to a target URL using browsy's zero-render browser. Automatically handle common obstacles:

1. **Cookie consent banners**: Detect and dismiss consent dialogs before extracting content
2. **Login walls**: If a login form is detected, prompt the user for credentials and authenticate
3. **CAPTCHA pages**: Detect CAPTCHA and inform the user that manual intervention is needed

## Steps

1. Use `browsy_browse` to navigate to the target URL
2. Check `browsy_page_info` for page type and suggested actions
3. If consent dialog detected, use `browsy_find` to locate accept/dismiss button, then `browsy_click`
4. If login required, use `browsy_login` with provided credentials
5. Use `browsy_tables` to extract structured table data if present
6. Use `browsy_find` to locate specific content elements
7. Return the extracted data in a clean, structured format
