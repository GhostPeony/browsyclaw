import { describe, it, expect, beforeEach } from "vitest";
import type { OpenClawAgentBootstrapEvent, ToolDescriptor } from "../../src/types.js";
import { createAgentBootstrapHook } from "../../src/plugin/hooks.js";
import { BrowsyContext } from "../../src/context.js";

describe("Agent Bootstrap Hook", () => {
  let ctx: BrowsyContext;
  let hook: (event: OpenClawAgentBootstrapEvent) => void;

  beforeEach(() => {
    ctx = new BrowsyContext({ port: 9999, autoStart: false });
    hook = createAgentBootstrapHook(ctx);
  });

  it("injects browsy tools into agent toolset", () => {
    let replacedTools: ToolDescriptor[] = [];

    const event: OpenClawAgentBootstrapEvent = {
      agentName: "test-agent",
      agentId: "a1",
      tools: [
        { name: "existing_tool", description: "An existing tool", execute: () => {} },
      ],
      replaceTools(tools) {
        replacedTools = tools;
      },
    };

    hook(event);

    expect(replacedTools.length).toBeGreaterThan(1);
    // Original tool preserved
    expect(replacedTools.find((t) => t.name === "existing_tool")).toBeDefined();
    // Browsy tools added
    expect(replacedTools.find((t) => t.name === "browsy_browse")).toBeDefined();
    expect(replacedTools.find((t) => t.name === "browsy_click")).toBeDefined();
    expect(replacedTools.find((t) => t.name === "browsy_search")).toBeDefined();
  });

  it("injects exactly 13 browsy tools", () => {
    let replacedTools: ToolDescriptor[] = [];

    const event: OpenClawAgentBootstrapEvent = {
      agentName: "test-agent",
      tools: [],
      replaceTools(tools) {
        replacedTools = tools;
      },
    };

    hook(event);
    expect(replacedTools).toHaveLength(14);
  });

  it("does not duplicate if browsy tools already exist", () => {
    let replacedTools: ToolDescriptor[] = [];

    const event: OpenClawAgentBootstrapEvent = {
      agentName: "test-agent",
      tools: [
        { name: "browsy_browse", description: "Already here", execute: () => {} },
      ],
      replaceTools(tools) {
        replacedTools = tools;
      },
    };

    hook(event);

    const browseTools = replacedTools.filter((t) => t.name === "browsy_browse");
    expect(browseTools).toHaveLength(1);
    // Should be the original, not replaced
    expect(browseTools[0]!.description).toBe("Already here");
  });
});
