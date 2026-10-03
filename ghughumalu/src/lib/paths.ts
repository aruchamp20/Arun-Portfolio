const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Absolute URL path for a file in /public, honouring the deploy base path. */
export function asset(path: string): string {
  return `${base}/${path.replace(/^\/+/, "")}`;
}
