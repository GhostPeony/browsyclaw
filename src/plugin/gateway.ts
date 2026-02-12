import type { BrowsyContext } from "../context.js";
import type { BrowsyServerInfo, BrowsySession } from "../types.js";

export interface GatewayMethods {
  "browsy.status": () => BrowsyServerInfo;
  "browsy.restart": () => Promise<BrowsyServerInfo>;
}

/**
 * Create RPC gateway methods for remote browsy management.
 */
export function createGatewayMethods(ctx: BrowsyContext): GatewayMethods {
  return {
    "browsy.status"() {
      return ctx.getStatus();
    },
    async "browsy.restart"() {
      await ctx.serverManager.stop();
      await ctx.serverManager.start();
      return ctx.getStatus();
    },
  };
}
