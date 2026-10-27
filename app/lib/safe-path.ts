// Only allow same-site relative paths as redirect and "back" targets, so a
// crafted link can't send people to another site.
export function safePath(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value.includes("\\") ? fallback : value;
}
