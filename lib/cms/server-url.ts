const PUBLIC_APEX = "ormondspinenervecenter.com";
const PREVIEW_ORIGIN = "https://nexmedfl.vercel.app";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

function isLocalHost(value: string): boolean {
  return /localhost|127\.0\.0\.1|\[::1\]/.test(value);
}

/** True when the URL's hostname is a Vercel project host (*.vercel.app). */
export function isVercelAppHost(value: string): boolean {
  try {
    const trimmed = value.trim();
    if (!trimmed) return false;
    const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return new URL(withProtocol).hostname.toLowerCase().endsWith(".vercel.app");
  } catch {
    return false;
  }
}

/**
 * Payload admin and API origin only. Public SEO uses SITE_URL.
 * NEXT_PUBLIC_SITE_URL is intentionally not a fallback.
 * On Vercel a localhost value is never used.
 * On Vercel production a *.vercel.app host is never used: the admin
 * session cookie is not sent on that cross-origin Blob token request.
 */
export function getServerURL(): string {
  const explicit = stripTrailingSlash(process.env.NEXT_PUBLIC_SERVER_URL || "");
  const onVercel = Boolean(process.env.VERCEL);
  const production = process.env.VERCEL_ENV === "production";
  const useExplicit =
    Boolean(explicit) &&
    !(onVercel && isLocalHost(explicit)) &&
    !(production && isVercelAppHost(explicit));

  if (useExplicit) return explicit;

  if (onVercel && production) {
    return `https://${PUBLIC_APEX}`;
  }

  if (onVercel) {
    const deployment = stripTrailingSlash(process.env.VERCEL_URL || "");
    return deployment ? `https://${deployment}` : PREVIEW_ORIGIN;
  }

  return explicit || "http://localhost:3000";
}

function addOrigin(origins: Set<string>, value?: string) {
  if (!value) return;
  const trimmed = stripTrailingSlash(value.trim());
  if (!trimmed) return;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    origins.add(trimmed);
    return;
  }
  origins.add(`https://${trimmed}`);
}

/** Public site, the Vercel project host, localhost, and the current deployment. */
export function getCorsOrigins(): string[] {
  const origins = new Set<string>([
    `https://${PUBLIC_APEX}`,
    `https://www.${PUBLIC_APEX}`,
    PREVIEW_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);
  addOrigin(origins, process.env.NEXT_PUBLIC_SERVER_URL);
  addOrigin(origins, process.env.VERCEL_URL);
  addOrigin(origins, process.env.VERCEL_PROJECT_PRODUCTION_URL);
  addOrigin(origins, process.env.VERCEL_BRANCH_URL);
  return [...origins];
}

export function isLocalDatabaseHost(connectionString?: string): boolean {
  if (!connectionString) return true;
  try {
    const host = new URL(connectionString).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return true;
  }
}
