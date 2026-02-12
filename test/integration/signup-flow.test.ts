/**
 * End-to-end signup flow test against a REAL browsy server + dynamic form server.
 *
 * This test requires:
 *   1. browsy CLI installed (set BROWSY_BIN if not in PATH)
 *   2. govform-lab HTML files at ../agentbrowser/benchmark/govform-lab/
 *      (override with GOVFORM_DIR env var)
 *
 * Run with:
 *   BROWSY_E2E=1 npm test -- test/integration/signup-flow.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { BrowsyContext } from "../../src/context.js";
import { createGovformServer } from "../fixtures/govform-server.js";

const SKIP = !process.env.BROWSY_E2E;

describe.skipIf(SKIP)("Signup Flow E2E", () => {
  let ctx: BrowsyContext;
  let govformPort: number;
  let base: string;
  const govform = createGovformServer();

  beforeAll(async () => {
    // Start the dynamic govform server (handles POST form submissions)
    govformPort = await govform.start();
    base = `http://127.0.0.1:${govformPort}`;

    // Start browsy context (auto-starts browsy serve)
    ctx = new BrowsyContext({
      port: Number(process.env.BROWSY_PORT ?? "3847"),
      autoStart: true,
      allowPrivateNetwork: true,
      serverTimeout: 15_000,
    });
    await ctx.ensureServer();
  }, 20_000);

  afterAll(async () => {
    await ctx.serverManager.stop();
    await govform.stop();
  });

  // -----------------------------------------------------------------------
  // Helper: parse JSON DOM and return elements array
  // -----------------------------------------------------------------------
  type El = {
    id: number;
    tag: string;
    role?: string;
    label?: string;
    type?: string;
    text?: string;
    name?: string;
    val?: string;
    checked?: boolean;
  };

  async function getElements(): Promise<El[]> {
    const json = await ctx.executeToolCall("getPage", { format: "json" });
    const dom = JSON.parse(json);
    return dom.els;
  }

  function findByLabel(els: El[], label: string): El | undefined {
    return els.find(
      (e) => e.label?.toLowerCase().includes(label.toLowerCase()) && e.tag === "input",
    );
  }

  function findButton(els: El[], text: string): El | undefined {
    return els.find(
      (e) => e.tag === "button" && e.text?.toLowerCase().includes(text.toLowerCase()),
    );
  }

  // -----------------------------------------------------------------------
  // Tests
  // -----------------------------------------------------------------------

  it("detects sign-in page and fills login form", async () => {
    const page = await ctx.executeToolCall("browse", {
      url: `${base}/forms/sign-in.html`,
    });
    expect(page).toContain("Sign in");

    // Page intelligence detects login
    const info = await ctx.executeToolCall("pageInfo", {});
    expect(info).toContain("Login");

    // Login compound action fills email + password and submits
    const result = await ctx.executeToolCall("login", {
      username: "user@example.com",
      password: "s3cret!pass",
    });
    // Form submits POST to /forms/consent.html → our server serves it
    expect(result).toContain("consent");
  }, 30_000);

  it("fills name form and navigates to benefits-step1", async () => {
    const page = await ctx.executeToolCall("browse", {
      url: `${base}/forms/name.html`,
    });
    expect(page).toContain("Name and identity");

    const els = await getElements();

    // Fill first name
    const first = findByLabel(els, "first");
    expect(first).toBeDefined();
    await ctx.executeToolCall("typeText", { id: first!.id, text: "Jane" });

    // Fill last name
    const last = findByLabel(els, "last");
    expect(last).toBeDefined();
    await ctx.executeToolCall("typeText", { id: last!.id, text: "Doe" });

    // Fill DOB
    const dob = els.find((e) => e.type === "date");
    expect(dob).toBeDefined();
    await ctx.executeToolCall("typeText", { id: dob!.id, text: "1990-05-15" });

    // Select email radio
    const emailRadio = els.find(
      (e) => e.role === "radio" && e.text?.toLowerCase().includes("email"),
    );
    if (emailRadio) {
      await ctx.executeToolCall("check", { id: emailRadio.id });
    }

    // Verify form state persists
    const updated = await getElements();
    const firstUpdated = updated.find((e) => e.id === first!.id);
    expect(firstUpdated?.val).toBe("Jane");

    // Submit → POST to /forms/benefits-step1.html
    const submitBtn = findButton(els, "continue");
    expect(submitBtn).toBeDefined();
    const result = await ctx.executeToolCall("click", { id: submitBtn!.id });
    expect(result).toContain("Benefits intake");
  }, 30_000);

  it("fills benefits-step1 with address + dropdown and navigates to step2", async () => {
    const page = await ctx.executeToolCall("browse", {
      url: `${base}/forms/benefits-step1.html`,
    });
    expect(page).toContain("Benefits intake");

    const els = await getElements();

    // Fill street address
    const address = findByLabel(els, "street");
    expect(address).toBeDefined();
    await ctx.executeToolCall("typeText", { id: address!.id, text: "123 Main St" });

    // Fill city
    const city = findByLabel(els, "city");
    expect(city).toBeDefined();
    await ctx.executeToolCall("typeText", { id: city!.id, text: "Springfield" });

    // Select state dropdown
    const stateSelect = els.find(
      (e) => e.tag === "select" && e.label?.toLowerCase().includes("state"),
    );
    expect(stateSelect).toBeDefined();
    await ctx.executeToolCall("select", { id: stateSelect!.id, value: "CA" });

    // Fill ZIP
    const zip = findByLabel(els, "zip");
    expect(zip).toBeDefined();
    await ctx.executeToolCall("typeText", { id: zip!.id, text: "90210" });

    // Submit → POST to /forms/benefits-step2.html
    const submitBtn = findButton(els, "continue");
    expect(submitBtn).toBeDefined();
    const result = await ctx.executeToolCall("click", { id: submitBtn!.id });
    expect(result).toContain("Benefits intake");
    expect(result).toContain("Step 2");
  }, 30_000);

  it("full multi-page flow: sign-in → consent → upload", async () => {
    // Step 1: Sign in
    await ctx.executeToolCall("browse", { url: `${base}/forms/sign-in.html` });
    const afterLogin = await ctx.executeToolCall("login", {
      username: "applicant@gov.example",
      password: "Passw0rd!",
    });
    // Should land on consent page
    expect(afterLogin.toLowerCase()).toContain("consent");

    // Step 2: Accept consent (find and check the checkbox, then submit)
    const consentEls = await getElements();
    const consentCheckbox = consentEls.find(
      (e) => e.role === "checkbox" && e.text?.toLowerCase().includes("privacy"),
    );
    if (consentCheckbox) {
      await ctx.executeToolCall("check", { id: consentCheckbox.id });
    }
    const consentSubmit = findButton(consentEls, "continue") ?? findButton(consentEls, "submit") ?? findButton(consentEls, "agree");
    if (consentSubmit) {
      const afterConsent = await ctx.executeToolCall("click", { id: consentSubmit.id });
      // Should land on upload page
      expect(afterConsent.toLowerCase()).toContain("upload");
    }
  }, 30_000);

  it("name → benefits-step1 → benefits-step2 → consent chain", async () => {
    // Step 1: Name form
    await ctx.executeToolCall("browse", { url: `${base}/forms/name.html` });
    let els = await getElements();

    const first = findByLabel(els, "first");
    const last = findByLabel(els, "last");
    if (first) await ctx.executeToolCall("typeText", { id: first.id, text: "Alex" });
    if (last) await ctx.executeToolCall("typeText", { id: last.id, text: "Smith" });

    let submit = findButton(els, "continue");
    expect(submit).toBeDefined();
    const step1Page = await ctx.executeToolCall("click", { id: submit!.id });
    expect(step1Page).toContain("Benefits intake");

    // Step 2: Benefits step 1
    els = await getElements();
    const address = findByLabel(els, "street");
    const city = findByLabel(els, "city");
    const zip = findByLabel(els, "zip");
    if (address) await ctx.executeToolCall("typeText", { id: address.id, text: "456 Oak Ave" });
    if (city) await ctx.executeToolCall("typeText", { id: city.id, text: "Portland" });
    if (zip) await ctx.executeToolCall("typeText", { id: zip.id, text: "97201" });

    const stateSelect = els.find(
      (e) => e.tag === "select" && e.label?.toLowerCase().includes("state"),
    );
    if (stateSelect) {
      await ctx.executeToolCall("select", { id: stateSelect.id, value: "WA" });
    }

    submit = findButton(els, "continue");
    expect(submit).toBeDefined();
    const step2Page = await ctx.executeToolCall("click", { id: submit!.id });
    expect(step2Page).toContain("Step 2");

    // Step 3: Benefits step 2
    els = await getElements();
    const income = els.find((e) => e.type === "number");
    if (income) await ctx.executeToolCall("typeText", { id: income.id, text: "45000" });

    const household = els.find((e) => e.tag === "select" && e.label?.toLowerCase().includes("household"));
    if (household) await ctx.executeToolCall("select", { id: household.id, value: "3" });

    // Check a program interest checkbox
    const programCheckbox = els.find(
      (e) => e.role === "checkbox" && e.text?.toLowerCase().includes("medical"),
    );
    if (programCheckbox) {
      await ctx.executeToolCall("check", { id: programCheckbox.id });
    }

    submit = findButton(els, "submit") ?? findButton(els, "continue");
    if (submit) {
      const consentPage = await ctx.executeToolCall("click", { id: submit.id });
      expect(consentPage.toLowerCase()).toContain("consent");
    }
  }, 60_000);

  it("search works through browsy", async () => {
    const results = await ctx.executeToolCall("search", {
      query: "gov benefits application",
      engine: "duckduckgo",
    });
    expect(results).toBeTruthy();
    const parsed = JSON.parse(results);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
  }, 30_000);
});
