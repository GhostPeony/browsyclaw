# openclaw-browsy

Zero-render browser plugin for OpenClaw. Integrates [browsy](https://browsy.dev) as a fast, lightweight alternative to Playwright/CDP for AI agent browsing tasks.

## Why browsy?

OpenClaw's built-in browser uses Playwright + CDP: ~300MB RAM, 2-5s per page. browsy handles 70%+ of agent browsing tasks (forms, logins, search, data extraction) at **10x speed** and **60x less memory** by parsing HTML into a Spatial DOM without rendering pixels.

## Install

```bash
npm install openclaw-browsy
```

Requires the `browsy` CLI binary in your PATH. Install from the [browsy releases](https://github.com/nichochar/agentbrowser/releases).

## Configure

In your OpenClaw config:

```json
{
  "plugins": {
    "openclaw-browsy": {
      "port": 3847,
      "autoStart": true,
      "allowPrivateNetwork": false,
      "preferBrowsy": true,
      "serverTimeout": 10000
    }
  }
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `port` | `3847` | Port for the browsy REST server |
| `autoStart` | `true` | Start `browsy serve` automatically on plugin init |
| `allowPrivateNetwork` | `false` | Allow fetching private/internal network URLs |
| `preferBrowsy` | `true` | Intercept built-in browser tool calls and redirect through browsy |
| `serverTimeout` | `10000` | Timeout (ms) waiting for server startup |

## Usage

### As an OpenClaw plugin

```typescript
// openclaw.config.ts
import { register } from "openclaw-browsy";
export default { register };
```

Once registered, every agent gets 13 browsy tools automatically:

| Tool | Description |
|------|-------------|
| `browsy_browse` | Navigate to a URL |
| `browsy_click` | Click an element by ID |
| `browsy_type_text` | Type text into an input |
| `browsy_check` | Check a checkbox/radio |
| `browsy_uncheck` | Uncheck a checkbox/radio |
| `browsy_select` | Select a dropdown option |
| `browsy_search` | Search the web |
| `browsy_login` | Log in with credentials |
| `browsy_enter_code` | Enter a 2FA/verification code |
| `browsy_find` | Find elements by text or ARIA role |
| `browsy_page_info` | Get page metadata and suggested actions |
| `browsy_tables` | Extract structured table data |
| `browsy_back` | Go back in browsing history |

### Standalone

```typescript
import { BrowsyContext } from "openclaw-browsy";

const ctx = new BrowsyContext({ port: 3847, autoStart: false });
const result = await ctx.executeToolCall("browse", { url: "https://example.com" });
console.log(result);
```

## Skills

Three runtime skills are included:

- **browse-and-extract** — Navigate + extract with auto-handling of login walls and cookie consent
- **web-research** — Search + read multiple pages + compile summary
- **form-filler** — Detect form fields + fill + submit using page intelligence

## License

MIT
