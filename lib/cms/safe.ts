const CMS_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`CMS timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/**
 * Run a CMS read and return the designed-site fallback when Payload or
 * Postgres is unavailable. Public pages must never 500 because the database
 * is down, and a hung connection must not hold the response open.
 */
export async function withCMS<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return fallback;
  try {
    return await withTimeout(fn(), CMS_TIMEOUT_MS);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown CMS error";
    console.error(`[cms] falling back: ${message}`);
    return fallback;
  }
}
