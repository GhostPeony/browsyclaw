# @openclaw/browsy

OpenClaw plugin integrating browsy as a fast, lightweight browser tool for AI agents.

## Build and test

```bash
npm install              # install dependencies
npm run build            # compile TypeScript
npm run typecheck        # type-check without emit
npm test                 # run all tests
npm run test:coverage    # run tests with coverage
```

## Architecture

```
src/
  index.ts              Entry point + register(api) for OpenClaw
  types.ts              All shared types
  config.ts             Default config + parseConfig()
  context.ts            BrowsyContext facade (singleton)
  core/
    client.ts           HTTP client for browsy REST API
    server-manager.ts   Manages browsy serve process lifecycle
    session-manager.ts  Agent-to-session mapping
    tool-definitions.ts 13 tool descriptors matching browsy API
  plugin/
    hooks.ts            preToolExecution + agent:bootstrap hooks
    service.ts          Background service (start/stop server)
    gateway.ts          browsy.status + browsy.restart RPC
    commands.ts         /browsy-status + /browsy-sessions CLI
  utils/
    process.ts          Port check, binary discovery
```

## Plugin pattern

Follows the 4-register pattern from openclaw-security:
1. `registerHook("preToolExecution", ...)` — intercept built-in browser tools
2. `registerHook("agent:bootstrap", ...)` — inject 13 browsy tools
3. `registerService("browsy-server", ...)` — manage server lifecycle
4. `registerGatewayMethod(...)` + `registerCommand(...)` — status/management

## Key decisions

- Pure proxy: no browsy logic in this package, just REST API calls via fetch()
- Session-per-agent: each OpenClaw agent gets an isolated browsy session
- Auto-start: spawns `browsy serve` on plugin init, polls /health until ready
- preferBrowsy: when true, intercepts built-in browser tool calls and redirects to browsy
