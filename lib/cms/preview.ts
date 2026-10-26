/**
 * Build a public preview path from a stored path or path segments.
 * Null, undefined, or any empty segment yields null so preview never
 * redirects at a broken URL.
 */
export function previewFromPath(
  segments?: string | Array<string | null | undefined> | null,
): string | null {
  if (segments == null) return null;

  if (Array.isArray(segments)) {
    if (segments.length === 0) return null;
    if (segments.some((segment) => segment == null || segment === "")) return null;
    return `/${segments.join("/")}/`;
  }

  const value = segments.trim();
  if (!value) return null;
  if (value === "/") return "/";

  const parts = value.split("/");
  const start = value.startsWith("/") ? 1 : 0;
  const end = value.endsWith("/") ? -1 : undefined;
  const internal = parts.slice(start, end);
  if (internal.length === 0) return null;
  if (internal.some((segment) => segment == null || segment === "")) return null;
  return `/${internal.join("/")}/`;
}

export function previewURL(path?: string | null): string | null {
  const secret = process.env.PREVIEW_SECRET;
  if (!secret) return null;
  const destination = previewFromPath(path);
  if (!destination) return null;
  const params = new URLSearchParams({
    path: destination,
    secret,
  });
  return `/next/preview/?${params.toString()}`;
}
