---
name: test-browsy-flow
description: Test a URL with the browsy CLI and report page detection accuracy
---

# Test Browsy Flow

Test browsy's page detection and interaction capabilities against a specific URL.

## Steps

1. Run `browsy browse <url>` to fetch and parse the target page
2. Run `browsy page-info` to get page type detection results
3. Review the Spatial DOM output for:
   - Correct element detection (forms, buttons, links, inputs)
   - Accurate page type classification
   - Proper suggested actions
   - Hidden element exposure (dropdowns, modals, tabs)
4. Test interactions if applicable:
   - Click a link or button
   - Fill a form field
   - Submit a search
5. Report findings:
   - Page type detected vs expected
   - Number of interactive elements found
   - Any missing or misidentified elements
   - Suggested improvements for browsy's heuristics
