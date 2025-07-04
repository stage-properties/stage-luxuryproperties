// hook to return the url from a server component
import { headers } from "next/headers";

export const useServerPathname = () => {
  // Access the headers
  const headerList = headers();

  // Retrieve the x-current-path header value
  const pathname = headerList.get("x-current-path");
  const fullURL = headerList.get("x-current-url");

  return {pathname, fullURL};
};