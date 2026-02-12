import type { BrowsyContext } from "../context.js";
import type {
  OpenClawToolEvent,
  OpenClawAgentBootstrapEvent,
} from "../types.js";
import { createBrowsyTools } from "../core/tool-definitions.js";

/** Built-in OpenClaw browser tool names that browsy can replace. */
const BROWSER_TOOL_NAMES = new Set([
  "browser",
  "web_browser",
  "playwright_browser",
  "browse_web",
]);

/**
 * Create a `preToolExecution` hook that intercepts built-in browser tool calls
 * and redirects them through browsy when `preferBrowsy` is enabled.
 */
export function createPreToolExecutionHook(
  ctx: BrowsyContext,
): (event: OpenClawToolEvent) => void {
  return (event: OpenClawToolEvent) => {
    if (!ctx.config.preferBrowsy) return;
    if (!BROWSER_TOOL_NAMES.has(event.tool.name)) return;

    // Intercept: abort the original tool and let the agent use browsy_browse instead
    event.abort(
      `[BROWSY] Tool '${event.tool.name}' intercepted — use browsy_browse instead for faster execution. ` +
        `browsy is a zero-render browser that handles this at 10x speed.`,
    );
  };
}

/**
 * Create an `agent:bootstrap` hook that injects the 13 browsy tools
 * into every agent's toolset at startup.
 */
export function createAgentBootstrapHook(
  ctx: BrowsyContext,
): (event: OpenClawAgentBootstrapEvent) => void {
  return (event: OpenClawAgentBootstrapEvent) => {
    const browsyTools = createBrowsyTools(ctx);

    // Merge browsy tools into the agent's existing tools
    const existingNames = new Set(event.tools.map((t) => t.name));
    const newTools = browsyTools.filter((t) => !existingNames.has(t.name));

    event.replaceTools([...event.tools, ...newTools]);
  };
}
