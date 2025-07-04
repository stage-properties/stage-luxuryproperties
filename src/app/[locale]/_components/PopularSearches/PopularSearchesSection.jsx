import { fetchPopularSearchesByPage } from "./service";
import PopularSearches from "./component/PopularSearches";
import { useServerPathname } from "../../_utils/useServerPathname";

export default async function PopularSearchesSection({ style, classname, headerStyle, parentStyleMobile }) {

    const { pathname } = useServerPathname()

  // If the path is not passed in, return null.
  if (!pathname) return null;

  // Remove 'ar/' from the beginning of the pathname, if present.
  // This handles cases like "/ar/..." and also converts "/ar" to "/".
  let modifiedPath = pathname;
  if (modifiedPath === "/ar") {
    modifiedPath = "/";
  } else {
    modifiedPath = modifiedPath.replace(/^\/ar\//, "/");
  }

  // Fetch data on the server side.
  const data = await fetchPopularSearchesByPage({ path: modifiedPath });

  if (!data || !data.popular_searches || !data.popular_searches.length) return null;

  return (
    <PopularSearches data={data.popular_searches} style={style} headerStyle={headerStyle} classname={classname} parentStyleMobile={parentStyleMobile} />
  );
};