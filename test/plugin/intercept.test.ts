import { describe, it, expect, beforeEach } from "vitest";
import type { OpenClawToolEvent, ToolDescriptor } from "../../src/types.js";
import { createPreToolExecutionHook } from "../../src/plugin/hooks.js";
import { BrowsyContext } from "../../src/context.js";

describe("Pre-Tool Execution Intercept", () => {
  let ctx: BrowsyContext;

  beforeEach(() => {
    ctx = new BrowsyContext({ port: 9999, autoStart: false, preferBrowsy: true });
  });

  function makeEvent(toolName: string) {
    const state: { reason: string | null } = { reason: null };
    const tool: ToolDescriptor = {
      name: toolName,
      description: "test tool",
      execute: () => {},
    };
    const event: OpenClawToolEvent = {
      tool,
      agentName: "test-agent",
      abort(reason) {
        state.reason = reason;
      },
    };
    return { event, state };
  }

  it("intercepts 'browser' tool when preferBrowsy is true", () => {
    const hook = createPreToolExecutionHook(ctx);
    const { event, state } = makeEvent("browser");
    hook(event);
    expect(state.reason).not.toBeNull();
    expect(state.reason).toContain("browsy_browse");
  });

  it("intercepts 'web_browser' tool", () => {
    const hook = createPreToolExecutionHook(ctx);
    const { event, state } = makeEvent("web_browser");
    hook(event);
    expect(state.reason).not.toBeNull();
  });

  it("intercepts 'playwright_browser' tool", () => {
    const hook = createPreToolExecutionHook(ctx);
    const { event, state } = makeEvent("playwright_browser");
    hook(event);
    expect(state.reason).not.toBeNull();
  });

  it("intercepts 'browse_web' tool", () => {
    const hook = createPreToolExecutionHook(ctx);
    const { event, state } = makeEvent("browse_web");
    hook(event);
    expect(state.reason).not.toBeNull();
  });

  it("does NOT intercept browsy's own tools", () => {
    const hook = createPreToolExecutionHook(ctx);
    const { event, state } = makeEvent("browsy_browse");
    hook(event);
    expect(state.reason).toBeNull();
  });

  it("does NOT intercept unrelated tools", () => {
    const hook = createPreToolExecutionHook(ctx);
    const { event, state } = makeEvent("read_file");
    hook(event);
    expect(state.reason).toBeNull();
  });

  it("does NOT intercept when preferBrowsy is false", () => {
    const ctxNoPrefer = new BrowsyContext({ port: 9999, autoStart: false, preferBrowsy: false });
    const hook = createPreToolExecutionHook(ctxNoPrefer);
    const { event, state } = makeEvent("browser");
    hook(event);
    expect(state.reason).toBeNull();
  });
});
