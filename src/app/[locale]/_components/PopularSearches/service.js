import { fetchAPI } from "@/app/[locale]/_utils/utils";

export const fetchPopularSearchesByPage = async ({path}) => {
    const apiEndpoint = `popularSearches?pageURL=${path}`;

    let response = await fetchAPI(apiEndpoint, "noCache");

    return response;
};