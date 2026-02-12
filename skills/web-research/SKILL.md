---
name: web-research
description: Search the web, read multiple pages, and compile a research summary
---

# Web Research

Conduct multi-page web research using browsy's fast search and browsing capabilities.

## Steps

1. Use `browsy_search` with the research query to get search results
2. Review the search result titles and snippets to identify the most relevant pages
3. Use `browsy_browse` to visit each relevant page (typically 3-5 pages)
4. For each page:
   - Check `browsy_page_info` for page type
   - Use `browsy_find` to locate key content sections
   - Extract relevant facts, data points, and quotes
5. Use `browsy_back` to return between pages as needed
6. Compile findings into a structured summary with source attribution
7. Highlight any conflicting information across sources
