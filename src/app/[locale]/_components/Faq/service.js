import { fetchAPI } from "@/app/[locale]/_utils/utils";

export const fetchFAQsByPage = async ({path}) => {
    const apiEndpoint = `faq?pageURL=${path}`;

    let response = await fetchAPI(apiEndpoint, "noCache");

    return response;
};