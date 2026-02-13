/**
 * openclaw-browsy — Zero-Render Browser Plugin
 *
 * Standalone entry point and OpenClaw plugin registration.
 */

// Re-export everything for standalone usage
export * from "./types.js";
export * from "./config.js";
export * from "./context.js";
export * from "./core/index.js";
export * from "./plugin/index.js";
export { isPortInUse, findBrowsyBinary } from "./utils/index.js";

import type { OpenClawPluginApi, BrowsyConfigInput } from "./types.js";
import { BrowsyContext } from "./context.js";
import { createPreToolExecutionHook, createAgentBootstrapHook } from "./plugin/hooks.js";
import { createBrowsyService } from "./plugin/service.js";
import { createGatewayMethods } from "./plugin/gateway.js";
import { createCommands } from "./plugin/commands.js";

// ---------------------------------------------------------------------------
// Global singleton
// ---------------------------------------------------------------------------

let _browsyContext: BrowsyContext | undefined;

/** Get or create the global BrowsyContext */
export function getBrowsyContext(): BrowsyContext {
  if (!_browsyContext) {
    _browsyContext = new BrowsyContext();
  }
  return _browsyContext;
}

/** Configure (or reconfigure) the global BrowsyContext */
export function configureBrowsy(configInput?: BrowsyConfigInput): BrowsyContext {
  _browsyContext = new BrowsyContext(configInput);
  return _browsyContext;
}

// ---------------------------------------------------------------------------
// OpenClaw plugin entry point
// ---------------------------------------------------------------------------

/**
 * Register this library as an OpenClaw plugin.
 *
 * ```ts
 * import { register } from "openclaw-browsy";
 * export default { register };
 * ```
 */
export function register(api: OpenClawPluginApi): BrowsyContext {
  const ctx = getBrowsyContext();

  // Hooks
  api.registerHook(
    "preToolExecution",
    createPreToolExecutionHook(ctx) as (...args: unknown[]) => unknown,
  );
  api.registerHook(
    "agent:bootstrap",
    createAgentBootstrapHook(ctx) as (...args: unknown[]) => unknown,
  );

  // Background service
  const service = createBrowsyService(ctx);
  api.registerService("browsy-server", service);

  // Gateway RPC methods
  const methods = createGatewayMethods(ctx);
  for (const [name, handler] of Object.entries(methods)) {
    api.registerGatewayMethod(name, handler as (...args: unknown[]) => unknown);
  }

  // CLI commands
  const commands = createCommands(ctx);
  for (const [name, cmd] of Object.entries(commands)) {
    api.registerCommand(name, cmd.handler);
  }

  return ctx;
}
