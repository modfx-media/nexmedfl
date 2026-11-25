const APEX_HOST = "ormondspinenervecenter.com";
const MEDIA_FILE_PREFIX = "/api/media/file/";

function isOwnMediaHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.+$/, "");
  if (host === APEX_HOST || host === `www.${APEX_HOST}`) return true;
  return host.length > ".vercel.app".length && host.endsWith(".vercel.app");
}

function pathnameOnly(value: string): string {
  const hash = value.indexOf("#");
  const noHash = hash === -1 ? value : value.slice(0, hash);
  const query = noHash.indexOf("?");
  return query === -1 ? noHash : noHash.slice(0, query);
}

/** `/api/media/file/<filename>` with no trailing slash, or null when it is not that path. */
function mediaFilePath(pathname: string): string | null {
  if (!pathname.startsWith(MEDIA_FILE_PREFIX)) return null;
  let rest = pathname.slice(MEDIA_FILE_PREFIX.length);
  while (rest.endsWith("/")) rest = rest.slice(0, -1);
  if (!rest) return null;
  const parts = rest.split("/");
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    if (!part || part === "." || part === "..") return null;
  }
  return `${MEDIA_FILE_PREFIX}${rest}`;
}

/**
 * Src for next/image. Own-site Payload file URLs (apex, www, any *.vercel.app,
 * or a relative /api/media/file path) become `/api/media/file/<filename>` with
 * no trailing slash. Disk `/images/...` paths and blob URLs are unchanged.
 * Metadata should keep the original absolute URL.
 */
export function imageSrcForRendering(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return src;

  if (trimmed.startsWith("/")) {
    const rewritten = mediaFilePath(pathnameOnly(trimmed));
    return rewritten ?? src;
  }

  if (!/^https?:\/\//i.test(trimmed)) return src;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return src;
  }
  if (!isOwnMediaHost(url.hostname)) return src;
  const rewritten = mediaFilePath(url.pathname);
  return rewritten ?? src;
}
