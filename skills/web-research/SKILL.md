# web-research

Search the web, visit multiple pages, and compile a research summary with source attribution.

## Usage

```
/web-research what are the best rust web frameworks in 2026
```

## What it does

Conducts multi-page web research using browsy's fast search and browsing:

- **Web search** — queries DuckDuckGo or Google via `browsy_search` and returns structured results with titles, URLs, and snippets
- **Selective reading** — reviews search result snippets to identify the 3-5 most relevant pages, then visits each with `browsy_browse`
- **Content extraction** — uses `browsy_find` and `browsy_tables` to pull key facts, data points, and structured content from each page
- **Source tracking** — maintains attribution for every fact extracted, linking claims back to their source URL
- **Conflict detection** — highlights when different sources present contradictory information
- **Session navigation** — uses `browsy_back` to navigate between pages efficiently within the same session

## Workflow

1. `browsy_search` — search with the research query
2. Review titles and snippets, rank by relevance
3. For each of the top 3-5 results:
   - `browsy_browse` — visit the page
   - `browsy_page_info` — check page type, handle any obstacles
   - `browsy_find` — locate key content sections
   - `browsy_tables` — extract structured data if present
   - Record relevant facts with source URL
4. `browsy_back` — navigate between pages as needed
5. Compile findings into structured summary
6. Flag any conflicting information across sources

## Example output

```
Searching: "best rust web frameworks 2026"...

Found 10 results. Reading top 4...

[1/4] https://blog.example.com/rust-web-2026
  - Actix Web: fastest benchmarks, 420k req/s
  - Axum: most popular, built on tokio + tower
  - Loco: Rails-like DX, growing fast

[2/4] https://survey.example.com/rust-2026
  - Survey of 2,300 Rust developers
  - Axum: 62% usage, Actix Web: 28%, Rocket: 18%

[3/4] https://benchmarks.example.com/web-frameworks
  - Actix Web: 418k req/s (confirms blog claim)
  - Axum: 395k req/s
  - Note: benchmarks vary by workload type

[4/4] https://docs.example.com/choosing-framework
  - Recommends Axum for most projects
  - Actix Web for maximum throughput
  - Loco for rapid prototyping

=== Summary ===

**Top Rust web frameworks (2026):**

1. **Axum** — Most popular (62% adoption). Built on tokio/tower ecosystem.
   Strong community, good docs. ~395k req/s.

2. **Actix Web** — Fastest raw throughput (~420k req/s). Mature, battle-tested.
   28% adoption.

3. **Loco** — Rails-like developer experience. Growing rapidly.
   Best for teams wanting convention-over-configuration.

**Conflicts:** Blog claims Actix at 420k req/s, benchmark site shows 418k.
Minor variance — likely different test configurations.

Sources:
- https://blog.example.com/rust-web-2026
- https://survey.example.com/rust-2026
- https://benchmarks.example.com/web-frameworks
- https://docs.example.com/choosing-framework
```

## Requirements

- `openclaw-browsy` plugin must be registered
- browsy server must be running (auto-started if `autoStart: true`)
- Internet access for web search and page fetching
