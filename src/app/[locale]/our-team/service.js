import { fetchAPI } from "@/app/[locale]/_utils/utils";

export const fetchPageInfo = async (locale) => {
  const apiEndpoint = `pageOurTeam?locale=${locale}`;
  try {
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  } catch (err) {
    return err.message;
  }
};
