import { describe, it, expect, beforeEach } from "vitest";
import { register } from "../../src/index.js";
import { createMockOpenClawApi } from "../fixtures/mock-openclaw-api.js";

describe("Plugin Registration", () => {
  let mock: ReturnType<typeof createMockOpenClawApi>;

  beforeEach(() => {
    mock = createMockOpenClawApi();
  });

  it("register() returns a BrowsyContext", () => {
    const ctx = register(mock.api);
    expect(ctx).toBeDefined();
    expect(ctx.config).toBeDefined();
    expect(ctx.client).toBeDefined();
    expect(ctx.serverManager).toBeDefined();
    expect(ctx.sessionManager).toBeDefined();
  });

  it("registers preToolExecution hook", () => {
    register(mock.api);
    expect(mock.hooks.has("preToolExecution")).toBe(true);
    expect(typeof mock.hooks.get("preToolExecution")).toBe("function");
  });

  it("registers agent:bootstrap hook", () => {
    register(mock.api);
    expect(mock.hooks.has("agent:bootstrap")).toBe(true);
    expect(typeof mock.hooks.get("agent:bootstrap")).toBe("function");
  });

  it("registers browsy-server service", () => {
    register(mock.api);
    expect(mock.services.has("browsy-server")).toBe(true);
    const service = mock.services.get("browsy-server")!;
    expect(typeof service.start).toBe("function");
    expect(typeof service.stop).toBe("function");
  });

  it("registers gateway methods", () => {
    register(mock.api);
    expect(mock.gatewayMethods.has("browsy.status")).toBe(true);
    expect(mock.gatewayMethods.has("browsy.restart")).toBe(true);
  });

  it("registers CLI commands", () => {
    register(mock.api);
    expect(mock.commands.has("browsy-status")).toBe(true);
    expect(mock.commands.has("browsy-sessions")).toBe(true);
  });

  it("registers exactly 2 hooks, 1 service, 2 gateway methods, 2 commands", () => {
    register(mock.api);
    expect(mock.hooks.size).toBe(2);
    expect(mock.services.size).toBe(1);
    expect(mock.gatewayMethods.size).toBe(2);
    expect(mock.commands.size).toBe(2);
  });
});
