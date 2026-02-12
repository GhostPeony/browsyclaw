import type { BrowsyContext } from "../context.js";

export interface BrowsyService {
  start(): Promise<void>;
  stop(): Promise<void>;
}

/**
 * Background service that manages the browsy server lifecycle.
 * Starts the server on plugin init (if autoStart), stops on shutdown.
 */
export function createBrowsyService(ctx: BrowsyContext): BrowsyService {
  return {
    async start() {
      if (ctx.config.autoStart) {
        await ctx.serverManager.start();
      }
    },
    async stop() {
      await ctx.serverManager.stop();
    },
  };
}
