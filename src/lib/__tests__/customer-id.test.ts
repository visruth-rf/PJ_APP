import { describe, expect, it } from "vitest";
import { generateBaseCustomerId, resolveCustomerIdCollision } from "../customer-id";

describe("generateBaseCustomerId", () => {
  it("creates IDs from first up-to-4 letters + last 4 phone digits", () => {
    expect(generateBaseCustomerId("Ramesh Kumar", "9876543210")).toBe("RAME3210");
    expect(generateBaseCustomerId("Om Prakash", "9012345678")).toBe("OM5678");
    expect(generateBaseCustomerId("Anu", "9876512340")).toBe("ANU2340");
  });

  it("removes non alphabetic characters from the name", () => {
    expect(generateBaseCustomerId("R. K!", "9876543210")).toBe("RK3210");
  });

  it("throws for invalid phone", () => {
    expect(() => generateBaseCustomerId("Ramesh", "98765")).toThrow("Phone number must be exactly 10 digits.");
  });
});

describe("resolveCustomerIdCollision", () => {
  it("returns base ID when no collision", () => {
    expect(resolveCustomerIdCollision("RAME3210", new Set(["ANU2340"]))).toBe("RAME3210");
  });

  it("appends numeric suffix when collision exists", () => {
    const existing = new Set(["RAME3210", "RAME3210-1", "RAME3210-2"]);
    expect(resolveCustomerIdCollision("RAME3210", existing)).toBe("RAME3210-3");
  });
});
