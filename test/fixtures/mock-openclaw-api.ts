import type { OpenClawPluginApi } from "../../src/types.js";

/**
 * Mock OpenClaw plugin API for testing plugin registration.
 */
export function createMockOpenClawApi() {
  const hooks = new Map<string, Function>();
  const services = new Map<string, { start?: () => void | Promise<void>; stop?: () => void | Promise<void> }>();
  const gatewayMethods = new Map<string, Function>();
  const commands = new Map<string, Function>();

  const api: OpenClawPluginApi = {
    registerHook(name, handler) {
      hooks.set(name, handler);
    },
    registerService(name, service) {
      services.set(name, service);
    },
    registerGatewayMethod(name, handler) {
      gatewayMethods.set(name, handler);
    },
    registerCommand(name, handler) {
      commands.set(name, handler);
    },
  };

  return { api, hooks, services, gatewayMethods, commands };
}
