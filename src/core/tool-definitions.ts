import type { ToolDescriptor } from "../types.js";
import type { BrowsyContext } from "../context.js";

/**
 * Create the 13 browsy tools that map to the browsy REST API.
 */
export function createBrowsyTools(ctx: BrowsyContext): ToolDescriptor[] {
  return [
    {
      name: "browsy_browse",
      description:
        "Navigate to a URL and return the page content. Use this to browse websites.",
      inputSchema: {
        type: "object",
        required: ["url"],
        properties: {
          url: { type: "string", description: "URL to navigate to" },
          format: {
            type: "string",
            description: "Output format: 'compact' (default) or 'json'",
          },
          scope: {
            type: "string",
            description:
              "Scope: 'all' (default), 'visible', 'above_fold', or 'visible_above_fold'",
          },
        },
      },
      async execute(params: unknown) {
        const p = params as { url: string; format?: string; scope?: string };
        return ctx.executeToolCall("browse", p);
      },
    },
    {
      name: "browsy_click",
      description:
        "Click an element by its ID. Links navigate to new pages, buttons submit forms.",
      inputSchema: {
        type: "object",
        required: ["id"],
        properties: {
          id: {
            type: "integer",
            minimum: 0,
            description: "Element ID to click",
          },
        },
      },
      async execute(params: unknown) {
        const p = params as { id: number };
        return ctx.executeToolCall("click", p);
      },
    },
    {
      name: "browsy_type_text",
      description: "Type text into an input field or textarea by element ID.",
      inputSchema: {
        type: "object",
        required: ["id", "text"],
        properties: {
          id: {
            type: "integer",
            minimum: 0,
            description: "Element ID of the text input",
          },
          text: {
            type: "string",
            description: "Text to type into the input",
          },
        },
      },
      async execute(params: unknown) {
        const p = params as { id: number; text: string };
        return ctx.executeToolCall("typeText", p);
      },
    },
    {
      name: "browsy_check",
      description: "Check a checkbox or radio button by element ID.",
      inputSchema: {
        type: "object",
        required: ["id"],
        properties: {
          id: {
            type: "integer",
            minimum: 0,
            description: "Element ID of the checkbox or radio button",
          },
        },
      },
      async execute(params: unknown) {
        const p = params as { id: number };
        return ctx.executeToolCall("check", p);
      },
    },
    {
      name: "browsy_uncheck",
      description: "Uncheck a checkbox or radio button by element ID.",
      inputSchema: {
        type: "object",
        required: ["id"],
        properties: {
          id: {
            type: "integer",
            minimum: 0,
            description: "Element ID of the checkbox or radio button",
          },
        },
      },
      async execute(params: unknown) {
        const p = params as { id: number };
        return ctx.executeToolCall("uncheck", p);
      },
    },
    {
      name: "browsy_select",
      description:
        "Select an option in a dropdown/select element by element ID and value.",
      inputSchema: {
        type: "object",
        required: ["id", "value"],
        properties: {
          id: {
            type: "integer",
            minimum: 0,
            description: "Element ID of the select element",
          },
          value: { type: "string", description: "Value to select" },
        },
      },
      async execute(params: unknown) {
        const p = params as { id: number; value: string };
        return ctx.executeToolCall("select", p);
      },
    },
    {
      name: "browsy_search",
      description:
        "Search the web and return structured results with title, URL, and snippet.",
      inputSchema: {
        type: "object",
        required: ["query"],
        properties: {
          query: { type: "string", description: "Search query" },
          engine: {
            type: "string",
            description: "Search engine: 'duckduckgo' (default) or 'google'",
          },
        },
      },
      async execute(params: unknown) {
        const p = params as { query: string; engine?: string };
        return ctx.executeToolCall("search", p);
      },
    },
    {
      name: "browsy_login",
      description:
        "Log in using detected login form fields. Requires a page with a login form loaded.",
      inputSchema: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", description: "Username or email" },
          password: { type: "string", description: "Password" },
        },
      },
      async execute(params: unknown) {
        const p = params as { username: string; password: string };
        return ctx.executeToolCall("login", p);
      },
    },
    {
      name: "browsy_enter_code",
      description:
        "Enter a verification or 2FA code into the detected code input field.",
      inputSchema: {
        type: "object",
        required: ["code"],
        properties: {
          code: {
            type: "string",
            description: "Verification or 2FA code",
          },
        },
      },
      async execute(params: unknown) {
        const p = params as { code: string };
        return ctx.executeToolCall("enterCode", p);
      },
    },
    {
      name: "browsy_find",
      description:
        "Find elements on the current page by text content or ARIA role.",
      inputSchema: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Find elements containing this text",
          },
          role: {
            type: "string",
            description: "Find elements with this ARIA role",
          },
        },
      },
      async execute(params: unknown) {
        const p = params as { text?: string; role?: string };
        return ctx.executeToolCall("find", p);
      },
    },
    {
      name: "browsy_page_info",
      description:
        "Get page metadata: page type, suggested actions (login/search/consent), alerts, pagination, title, and URL.",
      inputSchema: {
        type: "object",
        properties: {},
      },
      async execute() {
        return ctx.executeToolCall("pageInfo", {});
      },
    },
    {
      name: "browsy_tables",
      description:
        "Extract structured table data from the current page. Returns headers and rows.",
      inputSchema: {
        type: "object",
        properties: {},
      },
      async execute() {
        return ctx.executeToolCall("tables", {});
      },
    },
    {
      name: "browsy_back",
      description: "Go back to the previous page in browsing history.",
      inputSchema: {
        type: "object",
        properties: {},
      },
      async execute() {
        return ctx.executeToolCall("back", {});
      },
    },
  ];
}
