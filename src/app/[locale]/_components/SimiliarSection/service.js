import { fetchAPI } from "@/app/[locale]/_utils/utils";

export const fetchSimiliarPropertyData = async(id,type, communitySlug, locale) => {
    const apiEndpoint = type==="OFFPLAN"? `offplan/similiar/${id}?community_slug=${communitySlug}&locale=${locale}`:``;
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
}