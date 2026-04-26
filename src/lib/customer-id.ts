/**
 * Build the base Customer ID according to PRD rules:
 * - uppercase alphabetic letters only from the name
 * - first up-to-4 letters (no padding)
 * - append last 4 digits of phone
 */
export function generateBaseCustomerId(name: string, phone: string): string {
  const alphaOnlyName = name.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
  const phoneSuffix = phone.slice(-4);

  if (!alphaOnlyName) {
    throw new Error("Customer name must contain at least one alphabetic character.");
  }

  if (!/^\d{10}$/.test(phone)) {
    throw new Error("Phone number must be exactly 10 digits.");
  }

  return `${alphaOnlyName}${phoneSuffix}`;
}

/**
 * Resolve collisions by appending -1, -2... only when needed.
 */
export function resolveCustomerIdCollision(baseId: string, existingIds: Set<string>): string {
  if (!existingIds.has(baseId)) {
    return baseId;
  }

  let suffix = 1;
  while (existingIds.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseId}-${suffix}`;
}
