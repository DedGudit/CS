import { SectionKey } from "../types/roles";

export const SECTION_KEYS: SectionKey[] = [
  "dashboard",
  "orders",
  "tables",
  "menu",
  "staff",
  "analytics",
  "shifts",
  "settings",
];

export function isSectionKey(x: unknown): x is SectionKey {
  return typeof x === "string" && (SECTION_KEYS as readonly string[]).includes(x);
}

export function normalizeSection(x: unknown): SectionKey {
  if (isSectionKey(x)) return x;
  return "dashboard";
}
