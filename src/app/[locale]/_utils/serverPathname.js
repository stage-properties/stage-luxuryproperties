// src/app/[locale]/_utils/serverContext.ts
import { headers } from "next/headers";

export function serverPathname() {
  const hdrs = headers();
  const pathname = hdrs.get("x-current-path") || "";
  const fullURL = hdrs.get("x-current-url") || "";
  const origin = hdrs.get("x-current-origin") || "";
  return { pathname, fullURL, origin };
}
