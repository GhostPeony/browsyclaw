import { describe, it, expect } from "vitest";
import { createBrowsyTools } from "../../src/core/tool-definitions.js";
import { BrowsyContext } from "../../src/context.js";

describe("createBrowsyTools", () => {
  const ctx = new BrowsyContext({ port: 9999, autoStart: false });
  const tools = createBrowsyTools(ctx);

  it("creates exactly 13 tools", () => {
    expect(tools).toHaveLength(13);
  });

  const expectedNames = [
    "browsy_browse",
    "browsy_click",
    "browsy_type_text",
    "browsy_check",
    "browsy_uncheck",
    "browsy_select",
    "browsy_search",
    "browsy_login",
    "browsy_enter_code",
    "browsy_find",
    "browsy_page_info",
    "browsy_tables",
    "browsy_back",
  ];

  it("has all expected tool names", () => {
    const names = tools.map((t) => t.name);
    for (const name of expectedNames) {
      expect(names).toContain(name);
    }
  });

  it("all tools have descriptions", () => {
    for (const tool of tools) {
      expect(tool.description).toBeTruthy();
      expect(tool.description.length).toBeGreaterThan(10);
    }
  });

  it("all tools have execute functions", () => {
    for (const tool of tools) {
      expect(typeof tool.execute).toBe("function");
    }
  });

  it("all tools have inputSchema", () => {
    for (const tool of tools) {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema!.type).toBe("object");
    }
  });

  it("browsy_browse requires url", () => {
    const tool = tools.find((t) => t.name === "browsy_browse")!;
    expect(tool.inputSchema!.required).toContain("url");
  });

  it("browsy_click requires id", () => {
    const tool = tools.find((t) => t.name === "browsy_click")!;
    expect(tool.inputSchema!.required).toContain("id");
  });

  it("browsy_type_text requires id and text", () => {
    const tool = tools.find((t) => t.name === "browsy_type_text")!;
    const required = tool.inputSchema!.required as string[];
    expect(required).toContain("id");
    expect(required).toContain("text");
  });

  it("browsy_login requires username and password", () => {
    const tool = tools.find((t) => t.name === "browsy_login")!;
    const required = tool.inputSchema!.required as string[];
    expect(required).toContain("username");
    expect(required).toContain("password");
  });

  it("browsy_find has optional text and role", () => {
    const tool = tools.find((t) => t.name === "browsy_find")!;
    expect(tool.inputSchema!.required).toBeUndefined();
    const props = tool.inputSchema!.properties as Record<string, unknown>;
    expect(props.text).toBeDefined();
    expect(props.role).toBeDefined();
  });

  it("browsy_page_info has no required params", () => {
    const tool = tools.find((t) => t.name === "browsy_page_info")!;
    expect(tool.inputSchema!.required).toBeUndefined();
  });

  it("browsy_tables has no required params", () => {
    const tool = tools.find((t) => t.name === "browsy_tables")!;
    expect(tool.inputSchema!.required).toBeUndefined();
  });

  it("browsy_back has no required params", () => {
    const tool = tools.find((t) => t.name === "browsy_back")!;
    expect(tool.inputSchema!.required).toBeUndefined();
  });
});
