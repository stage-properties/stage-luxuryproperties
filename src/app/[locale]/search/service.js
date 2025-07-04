import { fetchAPI } from "../_utils/utils";

export const fetchSearchResults = async(queries) => {
    const apiEndpoint = `search?${queries}`;
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
}