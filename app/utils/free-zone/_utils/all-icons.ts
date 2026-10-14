import type { LucideIcon } from "lucide-react";

/** "MountainSnow" -> "mountain-snow", "Gamepad2" -> "gamepad-2" (Lucide's own naming) */
const toKebab = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .toLowerCase();

let promise: Promise<Map<string, LucideIcon>> | null = null;

/**
 * Every Lucide icon, by kebab-case name. One lazily loaded chunk on purpose: per-icon dynamic
 * imports would add a 1700-entry chunk map to the webpack runtime that every page downloads.
 */
export const loadAllIcons = () =>
  (promise ??= import("lucide-react").then(
    ({ icons }) =>
      new Map(Object.entries(icons as Record<string, LucideIcon>).map(([n, i]) => [toKebab(n), i]))
  ));
