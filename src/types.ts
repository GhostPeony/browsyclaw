/**
 * Shared types for @openclaw/browsy
 */

// ---------------------------------------------------------------------------
// OpenClaw Plugin API (structural fallback types)
// ---------------------------------------------------------------------------

/** Structural type for the OpenClaw plugin API — allows standalone usage without @openclaw/sdk */
export interface OpenClawPluginApi {
  registerHook(name: string, handler: (...args: unknown[]) => unknown): void;
  registerService(
    name: string,
    service: { start?: () => void | Promise<void>; stop?: () => void | Promise<void> },
  ): void;
  registerGatewayMethod(
    name: string,
    handler: (...args: unknown[]) => unknown,
  ): void;
  registerCommand(
    name: string,
    handler: (...args: unknown[]) => unknown,
  ): void;
}

export interface OpenClawToolEvent {
  tool: ToolDescriptor;
  agentName: string;
  agentId?: string;
  abort(reason: string): void;
}

export interface OpenClawAgentBootstrapEvent {
  agentName: string;
  agentId?: string;
  tools: ToolDescriptor[];
  replaceTools(tools: ToolDescriptor[]): void;
}

// ---------------------------------------------------------------------------
// Tool Descriptors
// ---------------------------------------------------------------------------

/** Framework-agnostic tool shape that works standalone or with OpenClaw */
export interface ToolDescriptor {
  name: string;
  description: string;
  execute: (...args: unknown[]) => unknown | Promise<unknown>;
  /** JSON Schema for the tool's input */
  inputSchema?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Browsy Configuration
// ---------------------------------------------------------------------------

export interface BrowsyConfig {
  /** Port for the browsy server (default: 3847) */
  port: number;
  /** Auto-start the browsy server on plugin init (default: true) */
  autoStart: boolean;
  /** Allow fetching private/internal network URLs (default: false) */
  allowPrivateNetwork: boolean;
  /** Intercept built-in browser tool and route through browsy (default: true) */
  preferBrowsy: boolean;
  /** Timeout in ms waiting for browsy server readiness (default: 10000) */
  serverTimeout: number;
}

export interface BrowsyConfigInput {
  port?: number;
  autoStart?: boolean;
  allowPrivateNetwork?: boolean;
  preferBrowsy?: boolean;
  serverTimeout?: number;
}

// ---------------------------------------------------------------------------
// Browsy Server
// ---------------------------------------------------------------------------

export type BrowsyServerStatus = "stopped" | "starting" | "running" | "error";

export interface BrowsyServerInfo {
  status: BrowsyServerStatus;
  port: number;
  pid?: number;
  error?: string;
}

// ---------------------------------------------------------------------------
// Browsy Session
// ---------------------------------------------------------------------------

export interface BrowsySession {
  agentId: string;
  token: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Browsy HTTP Client
// ---------------------------------------------------------------------------

export interface BrowsyResponse {
  ok: boolean;
  status: number;
  session: string;
  body: string;
  json?: unknown;
}
