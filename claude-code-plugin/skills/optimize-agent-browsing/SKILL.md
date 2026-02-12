---
name: optimize-agent-browsing
description: Analyze an OpenClaw agent's browser usage and recommend browsy migration
---

# Optimize Agent Browsing

Analyze an OpenClaw agent's browser tool usage patterns and identify opportunities to migrate from Playwright/CDP to browsy for faster, lighter execution.

## Steps

1. Review the agent's tool usage in its configuration or logs
2. Identify browser tool calls: `browser`, `web_browser`, `playwright_browser`, `browse_web`
3. Categorize usage patterns:
   - **Simple navigation** (read-only page fetching) → direct browsy replacement
   - **Form interaction** (login, search, data entry) → browsy handles natively
   - **Data extraction** (tables, structured content) → browsy tables/find
   - **JS-heavy SPAs** (React/Vue rendering required) → keep Playwright
   - **Screenshot/visual** (pixel-level inspection) → keep Playwright
4. For each migratable pattern, provide the equivalent browsy tool call
5. Estimate performance improvement (typically 10x faster, 60x less memory)
6. Generate a migration checklist with specific tool substitutions
