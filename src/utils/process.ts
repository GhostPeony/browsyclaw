import { createConnection } from "node:net";
import { execFileSync } from "node:child_process";

/**
 * Check if a port is currently in use.
 */
export function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: "127.0.0.1" });
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => {
      resolve(false);
    });
  });
}

/**
 * Find the browsy binary in PATH or common locations.
 * Returns the path to the binary, or null if not found.
 */
export function findBrowsyBinary(): string | null {
  // Try "browsy" in PATH first
  try {
    const cmd = process.platform === "win32" ? "where" : "which";
    const result = execFileSync(cmd, ["browsy"], {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    if (result) return result.split(/\r?\n/)[0]!;
  } catch {
    // Not in PATH
  }

  return null;
}
