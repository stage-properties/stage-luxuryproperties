import { fetchAPI } from "@/app/[locale]/_utils/utils";

export const fetchSearchSuggestions = async(query) => {
    const apiEndpoint = `search/suggestion?${query}`;
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response?.data;
}

