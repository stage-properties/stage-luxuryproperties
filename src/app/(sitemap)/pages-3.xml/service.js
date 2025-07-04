import { fetchAPI } from "@/app/[locale]/_utils/fetch";

export const fetchCommunities = async () => {
  const apiEndpoint = `communities/all`;
  try {
    let response = await fetchAPI(apiEndpoint, "noCache");
    return response;
  } catch (err) {
    return err.message;
  }
};