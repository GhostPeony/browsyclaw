import type { BrowsyContext } from "../context.js";

export interface CommandDefinition {
  description: string;
  handler: () => string;
}

/**
 * Create CLI commands for OpenClaw's command system.
 */
export function createCommands(
  ctx: BrowsyContext,
): Record<string, CommandDefinition> {
  return {
    "browsy-status": {
      description: "Show browsy server status — running/stopped, port, PID",
      handler() {
        const info = ctx.getStatus();
        const lines: string[] = [
          "=== Browsy Status ===",
          `Status: ${info.status}`,
          `Port: ${info.port}`,
        ];
        if (info.pid) lines.push(`PID: ${info.pid}`);
        if (info.error) lines.push(`Error: ${info.error}`);
        lines.push(`Active sessions: ${ctx.sessionManager.count()}`);
        return lines.join("\n");
      },
    },

    "browsy-sessions": {
      description: "List active browsy browsing sessions",
      handler() {
        const sessions = ctx.sessionManager.listSessions();
        if (sessions.length === 0) {
          return "No active browsy sessions.";
        }

        const lines = sessions.map(
          (s) =>
            `  ${s.agentId}: token=${s.token ? s.token.slice(0, 8) + "..." : "(pending)"} created=${s.createdAt}`,
        );
        return [
          `=== Browsy Sessions (${sessions.length}) ===`,
          ...lines,
        ].join("\n");
      },
    },
  };
}
