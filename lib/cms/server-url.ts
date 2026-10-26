const PUBLIC_APEX = "ormondspinenervecenter.com";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

function isLocalHost(value: string): boolean {
  return /localhost|127\.0\.0\.1|\[::1\]/.test(value);
}

/**
 * Admin and API origin. Prefers NEXT_PUBLIC_SERVER_URL, then
 * NEXT_PUBLIC_SITE_URL. On Vercel a localhost value is never used.
 */
export function getServerURL(): string {
  const explicit = stripTrailingSlash(
    process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL || "",
  );
  const onVercel = Boolean(process.env.VERCEL);

  if (explicit && !(onVercel && isLocalHost(explicit))) {
    return explicit;
  }

  if (onVercel) {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return `https://${PUBLIC_APEX}`;
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

/** www + apex, localhost, and the current Vercel host. */
export function getCorsOrigins(): string[] {
  const origins = new Set<string>([
    `https://${PUBLIC_APEX}`,
    `https://www.${PUBLIC_APEX}`,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);
  addOrigin(origins, process.env.NEXT_PUBLIC_SERVER_URL);
  addOrigin(origins, process.env.NEXT_PUBLIC_SITE_URL);
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
